import { SEAT_TYPES } from "../../config/constants";
import { AppDataSource } from "../../config/database";
import { Screen } from "../../database/entities/Screen";
import { Seat } from "../../database/entities/Seat";
import { MESSAGES } from "../../messages/messages";
import { AppError } from "../../utils/AppError";
import { CreateScreenDto } from "./types";

const screenRepository = AppDataSource.getRepository(Screen);

export const create = async (screenData: CreateScreenDto): Promise<Screen> => {
  // All operations are performed within a transaction to ensure data integrity
  return AppDataSource.transaction(async transactionalEntityManager => {
    // Validate that the totalSeats matches rows * seatsPerRow
    if (screenData.rows * screenData.seatsPerRow !== screenData.totalSeats) {
      throw new AppError(400, "VALIDATION_ERROR", MESSAGES.SCREEN.ERROR.INVALID_SEAT_CONFIGURATION);
    }

    // create the screen entity
    const screen = transactionalEntityManager.create(Screen, {
      name: screenData.name,
      totalSeats: screenData.totalSeats,
      rows: screenData.rows,
      seatsPerRow: screenData.seatsPerRow,
      rowTypeMapping: screenData.rowTypeMapping,
      isActive: true,
    });

    await transactionalEntityManager.save(screen);

    const seats: Seat[] = [];
    const ASCII_A = 65;

    // create the seats based on the provided screen row and seat configuration
    for (let i = 0; i < screenData.rows; i++) {
      const rowLetter = String.fromCharCode(ASCII_A + i);
      const seatType = screenData.rowTypeMapping[rowLetter] || SEAT_TYPES.STANDARD;

      for (let j = 1; j <= screenData.seatsPerRow; j++) {
        seats.push(
          transactionalEntityManager.create(Seat, {
            screenId: screen.id,
            row: rowLetter,
            number: j,
            seatId: `${rowLetter}${j}`,
            type: seatType,
          })
        );
      }
    }

    await transactionalEntityManager.save(Seat, seats);

    return transactionalEntityManager.findOne(Screen, {
      where: { id: screen.id },
      relations: ["seats"],
    }) as Promise<Screen>;
  });
};

export const getAll = async (
  page = 1,
  limit = 10
): Promise<{ data: Screen[]; total: number; page: number; totalPages: number }> => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const [data, total] = await screenRepository.findAndCount({
    where: { isActive: true },
    order: { createdAt: "DESC" },
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  });

  return {
    data,
    total,
    page: safePage,
    totalPages: Math.ceil(total / safeLimit),
  };
};

export const getById = async (id: string): Promise<Screen> => {
  const screen = await screenRepository.findOne({
    where: { id, isActive: true },
    relations: ["seats"],
  });

  if (!screen) {
    throw new AppError(404, "NOT_FOUND", MESSAGES.SCREEN.ERROR.NOT_FOUND);
  }

  return screen;
};
