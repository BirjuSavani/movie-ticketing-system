import { In } from "typeorm";
import { AppDataSource } from "../../config/database";
import { env } from "../../config/env";
import { BookedSeat } from "../../database/entities/BookedSeat";
import { Booking } from "../../database/entities/Booking";
import { Payment } from "../../database/entities/Payment";
import { SeatInventory } from "../../database/entities/SeatInventory";
import { Showtime } from "../../database/entities/Showtime";
import { MESSAGES } from "../../messages/messages";
import { AppError } from "../../utils/AppError";
import { generateBookingReference } from "../../utils/helpers";
import { TimeUtil } from "../../utils/time";

/** PostgreSQL error code for lock_not_available */
const PG_LOCK_NOT_AVAILABLE = "55P03";

const isLockNotAvailable = (err: unknown): boolean => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === PG_LOCK_NOT_AVAILABLE
  );
};

const bookingRepository = AppDataSource.getRepository(Booking);

/**
 * Booking cutoff logic (5 minutes before showtime)
 */
const BOOKING_CUTOFF_MINUTES = 5;

const validateShowtimeBookingWindow = (showtime: Showtime) => {
  const isClosed = TimeUtil.isBookingClosed(showtime.startsAt, BOOKING_CUTOFF_MINUTES);

  if (isClosed) {
    throw new AppError(
      400,
      "SHOWTIME_EXPIRED",
      `Booking closes ${BOOKING_CUTOFF_MINUTES} minutes before showtime starts.`
    );
  }
};

// RESERVE
export const reserve = async (
  userId: string,
  idempotencyKey: string | undefined,
  data: { showtimeId: string; seatIds: string[] }
) => {
  try {
    if (idempotencyKey) {
      const existingBooking = await bookingRepository.findOne({
        where: { userId, idempotencyKey },
        relations: ["bookedSeats", "bookedSeats.seatInventory"],
      });

      if (existingBooking) {
        return {
          bookingId: existingBooking.id,
          expiresAt: existingBooking.bookedSeats[0]?.seatInventory?.heldUntil ?? null,
          seats: existingBooking.bookedSeats.map(bs => ({
            seatId: bs.seatInventory?.seatId,
            price: bs.seatInventory?.price,
          })),
        };
      }
    }

    return await AppDataSource.transaction(async manager => {
      const seatInventories = await manager.find(SeatInventory, {
        where: {
          showtimeId: data.showtimeId,
          id: In(data.seatIds),
        },
      });

      if (seatInventories.length !== data.seatIds.length) {
        throw new AppError(400, "VALIDATION_ERROR", MESSAGES.BOOKING.INVALID_SEATS);
      }

      const showtime = await manager.findOne(Showtime, {
        where: { id: data.showtimeId },
      });

      if (!showtime) {
        throw new AppError(404, "SHOWTIME_NOT_FOUND", "Showtime not found");
      }

      // BOOKING CUT-OFF CHECK
      validateShowtimeBookingWindow(showtime);

      const lockedSeats = await manager.find(SeatInventory, {
        where: { id: In(seatInventories.map(s => s.id)) },
        order: { id: "ASC" },
        lock: { mode: "pessimistic_write", onLocked: "nowait" },
      });

      for (const seat of lockedSeats) {
        if (seat.status !== "available") {
          throw new AppError(409, "SEAT_UNAVAILABLE", MESSAGES.BOOKING.INVALID_SEATS_AVAILABLE);
        }
      }

      const heldUntil = TimeUtil.addMinutes(TimeUtil.nowUTC(), env.SEAT_HOLD_DURATION_MINUTES);

      for (const seat of lockedSeats) {
        seat.status = "held";
        seat.heldUntil = heldUntil;
      }

      await manager.save(SeatInventory, lockedSeats);

      const booking = manager.create(Booking, {
        userId,
        showtimeId: data.showtimeId,
        status: "pending",
        idempotencyKey: idempotencyKey ?? null,
      });

      await manager.save(Booking, booking);

      const bookedSeats = lockedSeats.map(seat =>
        manager.create(BookedSeat, {
          bookingId: booking.id,
          seatInventoryId: seat.id,
        })
      );

      await manager.save(BookedSeat, bookedSeats);

      return {
        bookingId: booking.id,
        expiresAt: heldUntil,
        seats: lockedSeats.map(s => ({
          seatId: s.seatId,
          price: s.price,
        })),
      };
    });
  } catch (err: unknown) {
    if (isLockNotAvailable(err)) {
      throw new AppError(409, "HIGH_CONTENTION", MESSAGES.BOOKING.HIGH_CONTENTION);
    }
    throw err;
  }
};

// CONFIRM
export const confirm = async (userId: string, bookingId: string, paymentData: any) => {
  try {
    return await AppDataSource.transaction(async manager => {
      const booking = await manager.findOne(Booking, {
        where: { id: bookingId },
        relations: ["bookedSeats", "bookedSeats.seatInventory"],
      });

      if (!booking) {
        throw new AppError(404, "BOOKING_NOT_FOUND", MESSAGES.BOOKING.BOOKING_NOT_FOUND);
      }

      if (booking.userId !== userId) {
        throw new AppError(403, "FORBIDDEN", MESSAGES.BOOKING.FORBIDDEN);
      }

      if (booking.status !== "pending") {
        throw new AppError(400, "VALIDATION_ERROR", `Booking is in ${booking.status}`);
      }

      const lockedSeats = await manager.find(SeatInventory, {
        where: { id: In(booking.bookedSeats.map(s => s.seatInventoryId)) },
        order: { id: "ASC" },
        lock: { mode: "pessimistic_write", onLocked: "nowait" },
      });

      let amount = 0;
      const now = TimeUtil.nowUTC();

      for (const seat of lockedSeats) {
        if (seat.status !== "held" || !seat.heldUntil || TimeUtil.isAfter(now, seat.heldUntil)) {
          throw new AppError(400, "BOOKING_EXPIRED", MESSAGES.BOOKING.BOOKING_EXPIRED);
        }
        amount += Number(seat.price);
      }

      for (const seat of lockedSeats) {
        seat.status = "booked";
      }

      await manager.save(SeatInventory, lockedSeats);

      booking.status = "confirmed";
      await manager.save(Booking, booking);

      const payment = manager.create(Payment, {
        bookingId: booking.id,
        status: "paid",
        paymentMethod: paymentData.paymentMethod,
        cardLastFour: paymentData.cardLastFour || "0000",
        bookingReference: generateBookingReference(),
        amount,
      });

      await manager.save(Payment, payment);

      return { booking, payment };
    });
  } catch (err) {
    if (isLockNotAvailable(err)) {
      throw new AppError(409, "HIGH_CONTENTION", MESSAGES.BOOKING.HIGH_CONTENTION);
    }
    throw err;
  }
};

// CANCEL
export const cancel = async (userId: string, bookingId: string, isAdmin: boolean) => {
  return await AppDataSource.transaction(async manager => {
    const booking = await manager.findOne(Booking, {
      where: { id: bookingId },
      relations: ["bookedSeats", "payment"],
    });

    if (!booking) {
      throw new AppError(404, "BOOKING_NOT_FOUND", MESSAGES.BOOKING.BOOKING_NOT_FOUND);
    }

    if (!isAdmin && booking.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", MESSAGES.BOOKING.FORBIDDEN);
    }

    const lockedSeats = await manager.find(SeatInventory, {
      where: { id: In(booking.bookedSeats.map(s => s.seatInventoryId)) },
      order: { id: "ASC" },
      lock: { mode: "pessimistic_write", onLocked: "nowait" },
    });

    for (const seat of lockedSeats) {
      seat.status = "available";
      seat.heldUntil = null;
    }

    await manager.save(SeatInventory, lockedSeats);

    booking.status = "cancelled";
    await manager.save(Booking, booking);

    return true;
  });
};

// READ APIs
export const getMyBookings = async (userId: string) => {
  return bookingRepository.find({
    where: { userId },
    relations: ["showtime", "showtime.movie", "payment"],
    order: { createdAt: "DESC" },
  });
};

export const getById = async (userId: string, bookingId: string, isAdmin: boolean) => {
  const booking = await bookingRepository.findOne({
    where: { id: bookingId },
    relations: [
      "showtime",
      "showtime.movie",
      "bookedSeats",
      "bookedSeats.seatInventory",
      "bookedSeats.seatInventory.seat",
      "payment",
    ],
  });

  if (!booking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", MESSAGES.BOOKING.BOOKING_NOT_FOUND);
  }

  if (!isAdmin && booking.userId !== userId) {
    throw new AppError(403, "FORBIDDEN", MESSAGES.BOOKING.FORBIDDEN);
  }

  return booking;
};
