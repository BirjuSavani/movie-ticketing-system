import { AppDataSource } from "../../config/database";
import { Screen } from "../../database/entities/Screen";
import { Seat } from "../../database/entities/Seat";
import { AppError } from "../../utils/AppError";

const screenRepository = AppDataSource.getRepository(Screen);

export const create = async (data: any): Promise<Screen> => {
  return await AppDataSource.transaction(async transactionalEntityManager => {
    const screen = transactionalEntityManager.create(Screen, {
      name: data.name,
      totalSeats: data.totalSeats,
      rows: data.rows,
      seatsPerRow: data.seatsPerRow,
      rowTypeMapping: data.rowTypeMapping,
    });

    await transactionalEntityManager.save(screen);

    const seats: Seat[] = [];

    for (let i = 0; i < data.rows; i++) {
      const rowLetter = String.fromCharCode(65 + i);
      const seatType = data.rowTypeMapping[rowLetter] || "standard";

      for (let j = 1; j <= data.seatsPerRow; j++) {
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

    if (seats.length !== data.totalSeats) {
      throw new AppError(400, "VALIDATION_ERROR", "totalSeats does not match rows * seatsPerRow");
    }

    await transactionalEntityManager.save(Seat, seats);

    return (await transactionalEntityManager.findOne(Screen, {
      where: { id: screen.id },
      relations: ["seats"],
    })) as Screen;
  });
};

export const getAll = async (): Promise<Screen[]> => {
  return await screenRepository.find();
};

export const getById = async (id: string): Promise<Screen> => {
  const screen = await screenRepository.findOne({
    where: { id },
    relations: ["seats"],
  });
  if (!screen) throw new AppError(404, "SCREEN_NOT_FOUND", "Screen not found.");
  return screen;
};
