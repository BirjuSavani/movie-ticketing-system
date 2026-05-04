import { SEAT_TYPES } from "../../config/constants";
import { AppDataSource } from "../../config/database";
import { Screen } from "../../database/entities/Screen";
import { SeatInventory } from "../../database/entities/SeatInventory";
import { Showtime } from "../../database/entities/Showtime";
import { MESSAGES } from "../../messages/messages";
import { AppError } from "../../utils/AppError";
import { TimeUtil } from "../../utils/time";
import { CreateShowtimeDto, GetShowtimesFilterDto, ShowtimeSeatDto } from "./types";

const showtimeRepository = AppDataSource.getRepository(Showtime);

export const create = async (data: CreateShowtimeDto): Promise<Showtime> => {
  return AppDataSource.transaction(async transactionalEntityManager => {

    const screen = await transactionalEntityManager.findOne(Screen, {
      where: { id: data.screenId },
      relations: ["seats"],
    });

    if (!screen) {
      throw new AppError(404, "SCREEN_NOT_FOUND", MESSAGES.SCREEN.ERROR.NOT_FOUND);
    }

    const movie = await transactionalEntityManager.findOne(Showtime, {
      where: { id: data.movieId },
    });

    if (!movie) {
      throw new AppError(404, "MOVIE_NOT_FOUND", MESSAGES.MOVIE.ERROR.NOT_FOUND);
    }

    // Check overlapping showtime on the same screen
    const overlapping = await transactionalEntityManager
      .createQueryBuilder(Showtime, "showtime")
      .where("showtime.screenId = :screenId", { screenId: data.screenId })
      .andWhere("((showtime.startsAt <= :endsAt AND showtime.endsAt >= :startsAt))", {
        startsAt: data.startsAt,
        endsAt: data.endsAt,
      })
      .getOne();

    if (overlapping) {
      throw new AppError(409, "CONFLICT", MESSAGES.SHOWTIME.ERROR.OVERLAP);
    }

    const showtime = transactionalEntityManager.create(Showtime, {
      movieId: data.movieId,
      screenId: data.screenId,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      basePrice: data.basePrice,
    });

    await transactionalEntityManager.save(showtime);

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

export const getAll = async (
  filter: GetShowtimesFilterDto
): Promise<{
  data: Showtime[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  const { movieId, screenId, date, page = 1, limit = 10 } = filter;

  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const queryBuilder = showtimeRepository
    .createQueryBuilder("showtime")
    .leftJoinAndSelect("showtime.movie", "movie")
    .leftJoinAndSelect("showtime.screen", "screen")
    .orderBy("showtime.startsAt", "ASC");

  if (movieId) queryBuilder.andWhere("showtime.movieId = :movieId", { movieId: movieId });
  if (screenId) queryBuilder.andWhere("showtime.screenId = :screenId", { screenId: screenId });

  if (date) {
    const { start: startDate, end: endDate } = TimeUtil.getISTDayRange(date);

    queryBuilder.andWhere("showtime.startsAt BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    });
  }

  queryBuilder.skip((safePage - 1) * safeLimit).take(safeLimit);

  const [data, total] = await queryBuilder.getManyAndCount();

  return {
    data,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit),
  };
};

export const getById = async (id: string): Promise<Showtime> => {
  const showtime = await showtimeRepository.findOne({
    where: { id },
    relations: ["movie", "screen"],
  });

  if (!showtime) {
    throw new AppError(404, "SHOWTIME_NOT_FOUND", MESSAGES.SHOWTIME.ERROR.NOT_FOUND);
  }

  return showtime;
};

export const getSeats = async (id: string): Promise<ShowtimeSeatDto[]> => {
  const exists = await getById(id);

  if (!exists) {
    throw new AppError(404, "SHOWTIME_NOT_FOUND", MESSAGES.SHOWTIME.ERROR.NOT_FOUND);
  }

  const inventoryRepo = AppDataSource.getRepository(SeatInventory);

  const seats = await inventoryRepo.find({
    where: { showtimeId: id },
    relations: ["seat"],
    order: {
      seat: { row: "ASC", number: "ASC" },
    },
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
