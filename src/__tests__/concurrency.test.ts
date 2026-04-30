import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/database";
import { env } from "../config/env";
import { Booking } from "../entities/Booking";
import { Movie } from "../entities/Movie";
import { Screen } from "../entities/Screen";
import { Seat } from "../entities/Seat";
import { SeatInventory } from "../entities/SeatInventory";
import { Showtime } from "../entities/Showtime";
import { User } from "../entities/User";
import { BookedSeat } from "../entities/BookedSeat";
import { TimeUtil } from "../utils/time";

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.dropDatabase();
  await AppDataSource.synchronize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Concurrency Test - Seat Reservation", () => {
  let showtimeId: string;
  let targetSeatId: string;
  let tokens: string[] = [];

  beforeAll(async () => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < 10; i++) {
        const hashedPassword = await bcrypt.hash("password123", 10);
        const user = queryRunner.manager.create(User, {
          name: `Test User ${i}`,
          email: `test${i}@example.com`,
          password: hashedPassword,
          role: "customer",
        });
        await queryRunner.manager.save(user);

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        tokens.push(token);
      }

      const movie = queryRunner.manager.create(Movie, {
        title: "Concurrency Movie",
        description: "Testing race conditions",
        genre: "Action",
        language: "English",
        durationMinutes: 120,
        rating: "UA",
        releaseDate: TimeUtil.nowUTC(),
      });
      await queryRunner.manager.save(movie);

      const screen = queryRunner.manager.create(Screen, {
        name: "Screen 1",
        totalSeats: 3,
        rows: 1,
        seatsPerRow: 3,
        rowTypeMapping: { A: "standard" },
      });
      await queryRunner.manager.save(screen);

      const seat1 = await queryRunner.manager.save(
        queryRunner.manager.create(Seat, {
          screenId: screen.id,
          row: "A",
          number: 1,
          seatId: "A1",
          type: "standard",
        })
      );
      const seat2 = await queryRunner.manager.save(
        queryRunner.manager.create(Seat, {
          screenId: screen.id,
          row: "A",
          number: 2,
          seatId: "A2",
          type: "standard",
        })
      );
      const seat3 = await queryRunner.manager.save(
        queryRunner.manager.create(Seat, {
          screenId: screen.id,
          row: "A",
          number: 3,
          seatId: "A3",
          type: "standard",
        })
      );

      const startsAt = TimeUtil.addMinutes(TimeUtil.nowUTC(), 120);
      const endsAt = TimeUtil.addMinutes(startsAt, 120);

      const showtime = queryRunner.manager.create(Showtime, {
        movieId: movie.id,
        screenId: screen.id,
        startsAt,
        endsAt,
        basePrice: 100,
      });
      await queryRunner.manager.save(showtime);
      showtimeId = showtime.id;

      const inv1 = await queryRunner.manager.save(
        queryRunner.manager.create(SeatInventory, {
          seatId: seat1.id,
          showtimeId,
          status: "available",
          price: 100,
        })
      );
      await queryRunner.manager.save(
        queryRunner.manager.create(SeatInventory, {
          seatId: seat2.id,
          showtimeId,
          status: "available",
          price: 100,
        })
      );
      await queryRunner.manager.save(
        queryRunner.manager.create(SeatInventory, {
          seatId: seat3.id,
          showtimeId,
          status: "available",
          price: 100,
        })
      );

      targetSeatId = inv1.id;

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  });

  it("should allow only exactly 1 request to reserve the same seat, others should fail with 409", async () => {
    const promises = tokens.map(token =>
      request(app)
        .post("/api/v1/bookings/reserve")
        .set("Authorization", `Bearer ${token}`)
        .send({
          showtimeId,
          seatIds: [targetSeatId],
        })
    );

    const responses = await Promise.all(promises);

    const successResponses = responses.filter(r => r.status === 201);
    const conflictResponses = responses.filter(r => r.status === 409);

    expect(successResponses.length).toBe(1);
    expect(conflictResponses.length).toBe(9);

    const inventory = await AppDataSource.getRepository(SeatInventory).findOne({
      where: { id: targetSeatId },
    });
    expect(inventory?.status).toBe("held");

    const bookedSeats = await AppDataSource.getRepository(BookedSeat).find({
      where: { seatInventoryId: targetSeatId },
    });
    expect(bookedSeats.length).toBe(1);

    const booking = await AppDataSource.getRepository(Booking).findOne({
      where: { id: (bookedSeats[0] as any).bookingId },
    });
    expect(booking).toBeDefined();
    expect(booking?.status).toBe("pending");
  });
});
