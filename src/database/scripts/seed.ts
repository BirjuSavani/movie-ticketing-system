import bcrypt from "bcrypt";
import { ROLES } from "../../config/constants";
import { AppDataSource } from "../../config/database";
import * as movieService from "../../modules/movies/service";
import * as screenService from "../../modules/screens/service";
import * as showtimeService from "../../modules/showtimes/service";
import { logger } from "../../utils/logger";
import { TimeUtil } from "../../utils/time";

const runSeed = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected for seeding...");

    // ================= USERS =================
    const userRepo = AppDataSource.getRepository("User");

    const existingAdmin = await userRepo.findOne({
      where: { email: "admin@example.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("password123", 12);

      await userRepo.save(
        userRepo.create({
          name: "Admin User",
          email: "admin@example.com",
          password: hashedPassword,
          role: ROLES.ADMIN,
        })
      );

      logger.info("Admin user created");
    }

    // ================= MOVIES =================
    const movieRepo = AppDataSource.getRepository("Movie");

    let movie1 = await movieRepo.findOne({ where: { title: "Inception" } });
    let movie2 = await movieRepo.findOne({ where: { title: "The Dark Knight" } });

    if (!movie1) {
      movie1 = await movieService.create({
        title: "Inception",
        description: "Dream hacking movie",
        genre: "Sci-Fi",
        language: "English",
        durationMinutes: 148,
        rating: "UA",
        releaseDate: TimeUtil.fromIST("2020-04-30"),
      } as any);
    }

    if (!movie2) {
      movie2 = await movieService.create({
        title: "The Dark Knight",
        description: "Batman vs Joker",
        genre: "Action",
        language: "English",
        durationMinutes: 152,
        rating: "UA",
        releaseDate: TimeUtil.fromIST("2008-07-18"),
      } as any);
    }

    // ================= SCREEN =================
    const screenRepo = AppDataSource.getRepository("Screen");

    let screen1 = await screenRepo.findOne({
      where: { name: "Screen 1" },
    });

    if (!screen1) {
      screen1 = await screenService.create({
        name: "Screen 1",
        totalSeats: 60,
        rows: 6,
        seatsPerRow: 10,
        rowTypeMapping: {
          A: "vip",
          B: "vip",
          C: "premium",
          D: "premium",
          E: "standard",
          F: "standard",
        },
        isActive: true,
      });
    }

    // ================= SHOWTIME =================
    const showtimeRepo = AppDataSource.getRepository("Showtime");

    const existingShowtime = await showtimeRepo.findOne({
      where: {
        screenId: screen1.id,
        movieId: movie1.id,
      },
    });

    if (!existingShowtime) {
      // Create showtime in IST properly
      const istNow = TimeUtil.now();

      const startsAtIST = istNow
        .plus({ days: 1 }) // tomorrow
        .set({ hour: 18, minute: 0, second: 0, millisecond: 0 });

      const endsAtIST = startsAtIST.plus({ minutes: 148 });

      await showtimeService.create({
        movieId: movie1.id,
        screenId: screen1.id,
        startsAt: startsAtIST.toJSDate(), // stored as UTC
        endsAt: endsAtIST.toJSDate(),
        basePrice: 150,
      } as any);

      logger.info("Showtime created (IST 6 PM)");
    }

    logger.info("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    logger.error("Error during seeding:", error);
    process.exit(1);
  }
};

runSeed();
