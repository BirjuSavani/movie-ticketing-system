import cron from "node-cron";
import { In, LessThan } from "typeorm";
import { AppDataSource } from "../config/database";
import { Booking } from "../database/entities/Booking";
import { SeatInventory } from "../database/entities/SeatInventory";
import { logger } from "../utils/logger";
import { TimeUtil } from "../utils/time";

export const startHoldExpiryJob = () => {
  const job = cron.schedule("* * * * *", async () => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = TimeUtil.nowUTC();

      // Get all held seats that have expired
      const expiredSeats = await queryRunner.manager.find(SeatInventory, {
        where: {
          status: "held",
          heldUntil: LessThan(now),
        },
        take: 100,
        lock: { mode: "pessimistic_write", onLocked: "skip_locked" },
      });

      if (expiredSeats.length > 0) {
        const seatInventoryIds = expiredSeats.map(s => s.id);

        // Update status and heldUntil for expired seats
        for (const seat of expiredSeats) {
          seat.status = "available";
          seat.heldUntil = null;
        }
        await queryRunner.manager.save(SeatInventory, expiredSeats);

        // Find associated bookings and mark them as expired
        const bookedSeats = await queryRunner.manager.find("BookedSeat", {
          where: { seatInventoryId: In(seatInventoryIds) },
        });

        // Remove duplicates
        const bookingIds = [...new Set(bookedSeats.map((bs: any) => bs.bookingId))];

        if (bookingIds.length > 0) {
          // Update status for expired bookings
          const bookings = await queryRunner.manager.find(Booking, {
            where: {
              id: In(bookingIds),
              status: "pending",
            },
          });

          for (const booking of bookings) {
            booking.status = "expired";
          }
          await queryRunner.manager.save(Booking, bookings);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      logger.error("Error in holdExpiry cron job:", { error });
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  });

  logger.info("Hold Expiry Cron Job scheduled.");
  return job;
};
