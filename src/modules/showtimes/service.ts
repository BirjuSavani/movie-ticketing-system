import { SEAT_TYPES } from "../../config/constants";
import { AppDataSource } from "../../config/database";
import { Screen } from "../../database/entities/Screen";
import { SeatInventory } from "../../database/entities/SeatInventory";
import { Showtime } from "../../database/entities/Showtime";
import { AppError } from "../../utils/AppError";
import { TimeUtil } from "../../utils/time";

const showtimeRepository = AppDataSource.getRepository(Showtime);

export const create = async (data: any): Promise<Showtime> => {
  return await AppDataSource.transaction(async transactionalEntityManager => {
    // Check overlapping showtimes on the same screen
    const overlapping = await transactionalEntityManager
      .createQueryBuilder(Showtime, "showtime")
      .where("showtime.screenId = :screenId", { screenId: data.screenId })
      .andWhere("((showtime.startsAt <= :endsAt AND showtime.endsAt >= :startsAt))", {
        startsAt: data.startsAt,
        endsAt: data.endsAt,
      })
      .getOne();

    if (overlapping) {
      throw new AppError(
        409,
        "CONFLICT",
        "Showtime overlaps with an existing showtime on this screen."
      );
    }

    const showtime = transactionalEntityManager.create(Showtime, {
      movieId: data.movieId,
      screenId: data.screenId,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      basePrice: data.basePrice,
    });

    await transactionalEntityManager.save(showtime);

    // Auto-generate SeatInventory
    const screen = await transactionalEntityManager.findOne(Screen, {
      where: { id: data.screenId },
      relations: ["seats"],
    });

    if (!screen) {
      throw new AppError(404, "SCREEN_NOT_FOUND", "Screen not found.");
    }

    const inventories = screen.seats.map(seat => {
      let multiplier = 1;
      if (seat.type === SEAT_TYPES.PREMIUM) multiplier = 1.5;
      if (seat.type === SEAT_TYPES.VIP) multiplier = 2.0;

      return transactionalEntityManager.create(SeatInventory, {
        seatId: seat.id,
        showtimeId: showtime.id,
        status: "available",
        price: Number(data.basePrice) * multiplier,
      });
    });

    await transactionalEntityManager.save(SeatInventory, inventories);

    return showtime;
  });
};

export const getAll = async (filter: any): Promise<Showtime[]> => {
  const queryBuilder = showtimeRepository
    .createQueryBuilder("showtime")
    .leftJoinAndSelect("showtime.movie", "movie")
    .leftJoinAndSelect("showtime.screen", "screen");

  if (filter.movieId)
    queryBuilder.andWhere("showtime.movieId = :movieId", { movieId: filter.movieId });
  if (filter.screenId)
    queryBuilder.andWhere("showtime.screenId = :screenId", { screenId: filter.screenId });

  if (filter.date) {
    const { start: startDate, end: endDate } = TimeUtil.getISTDayRange(filter.date);

    queryBuilder.andWhere("showtime.startsAt BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    });
  }

  return await queryBuilder.getMany();
};

export const getById = async (id: string): Promise<Showtime> => {
  const showtime = await showtimeRepository.findOne({
    where: { id },
    relations: ["movie", "screen"],
  });
  if (!showtime) throw new AppError(404, "SHOWTIME_NOT_FOUND", "Showtime not found.");
  return showtime;
};

export const getSeats = async (id: string) => {
  const showtime = await getById(id);

  const inventoryRepo = AppDataSource.getRepository(SeatInventory);
  const seats = await inventoryRepo.find({
    where: { showtimeId: id },
    relations: ["seat"],
    order: { seat: { row: "ASC", number: "ASC" } },
  });

  return seats.map(inv => ({
    id: inv.id,
    seatId: inv.seatId,
    row: inv.seat.row,
    number: inv.seat.number,
    label: inv.seat.seatId,
    type: inv.seat.type,
    status: inv.status,
    heldUntil: inv.heldUntil,
    price: inv.price,
  }));
};
