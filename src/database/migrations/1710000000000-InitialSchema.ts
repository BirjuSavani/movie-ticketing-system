import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchemaWithAllFeatures1710000000000 implements MigrationInterface {
  name = 'InitialSchemaWithAllFeatures1710000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // USERS
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password" varchar(255) NOT NULL,
        "role" varchar(50) NOT NULL DEFAULT 'customer',
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // REFRESH TOKENS
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" varchar(500) NOT NULL,
        "userId" uuid NOT NULL,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id")
      )
    `);

    // MOVIES
    await queryRunner.query(`
      CREATE TABLE "movies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "genre" varchar(100) NOT NULL,
        "language" varchar(50) NOT NULL,
        "durationMinutes" integer NOT NULL,
        "rating" varchar(10) NOT NULL,
        "releaseDate" date NOT NULL,
        "posterUrl" varchar(500),
        "isActive" boolean DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_movies" PRIMARY KEY ("id")
      )
    `);

    // SCREENS
    await queryRunner.query(`
      CREATE TABLE "screens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(100) NOT NULL,
        "totalSeats" integer NOT NULL,
        "rows" integer NOT NULL,
        "seatsPerRow" integer NOT NULL,
        "rowTypeMapping" jsonb NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_screens" PRIMARY KEY ("id")
      )
    `);

    // SEATS
    await queryRunner.query(`
      CREATE TABLE "seats" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "screenId" uuid NOT NULL,
        "row" varchar(10) NOT NULL,
        "number" integer NOT NULL,
        "seatId" varchar(20) NOT NULL,
        "type" varchar(20) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_seats" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_seats_screenId" ON "seats" ("screenId")`);

    // SHOWTIMES
    await queryRunner.query(`
      CREATE TABLE "showtimes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "movieId" uuid NOT NULL,
        "screenId" uuid NOT NULL,
        "startsAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "endsAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "basePrice" numeric(10,2) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_showtimes" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_showtimes_movieId" ON "showtimes" ("movieId")`);
    await queryRunner.query(`CREATE INDEX "IDX_showtimes_screenId" ON "showtimes" ("screenId")`);

    // SEAT INVENTORY
    await queryRunner.query(`
      CREATE TABLE "seat_inventory" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "seatId" uuid NOT NULL,
        "showtimeId" uuid NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'available',
        "heldUntil" TIMESTAMP WITH TIME ZONE,
        "price" numeric(10,2) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_seat_inventory" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_seat_inventory_showtime_status" ON "seat_inventory" ("showtimeId", "status")`);
    await queryRunner.query(`CREATE INDEX "IDX_seat_inventory_seatId" ON "seat_inventory" ("seatId")`);

    // Prevent double booking
    await queryRunner.query(`
      CREATE UNIQUE INDEX "unique_active_seat"
      ON "seat_inventory" ("showtimeId", "seatId")
      WHERE status IN ('held', 'booked')
    `);

    // BOOKINGS
    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "showtimeId" uuid NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'pending',
        "idempotencyKey" varchar(100),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_bookings_idempotencyKey" UNIQUE ("idempotencyKey")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_bookings_user_status" ON "bookings" ("userId", "status")`);

    // BOOKED SEATS
    await queryRunner.query(`
      CREATE TABLE "booked_seats" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid NOT NULL,
        "seatInventoryId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_booked_seats" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_booking_seat" UNIQUE ("bookingId", "seatInventoryId")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_booked_seats_bookingId" ON "booked_seats" ("bookingId")`);

    // PAYMENTS
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid NOT NULL,
        "status" varchar(20) NOT NULL,
        "paymentMethod" varchar(100) NOT NULL,
        "cardLastFour" varchar(4) NOT NULL,
        "bookingReference" varchar(50) NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_booking_reference" UNIQUE ("bookingReference"),
        CONSTRAINT "UQ_booking_payment" UNIQUE ("bookingId")
      )
    `);

    // FOREIGN KEYS
    await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "seats" ADD CONSTRAINT "FK_seat_screen" FOREIGN KEY ("screenId") REFERENCES "screens"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "showtimes" ADD CONSTRAINT "FK_showtime_movie" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "showtimes" ADD CONSTRAINT "FK_showtime_screen" FOREIGN KEY ("screenId") REFERENCES "screens"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "seat_inventory" ADD CONSTRAINT "FK_inventory_seat" FOREIGN KEY ("seatId") REFERENCES "seats"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "seat_inventory" ADD CONSTRAINT "FK_inventory_showtime" FOREIGN KEY ("showtimeId") REFERENCES "showtimes"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_booking_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_booking_showtime" FOREIGN KEY ("showtimeId") REFERENCES "showtimes"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "booked_seats" ADD CONSTRAINT "FK_booked_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "booked_seats" ADD CONSTRAINT "FK_booked_inventory" FOREIGN KEY ("seatInventoryId") REFERENCES "seat_inventory"("id") ON DELETE RESTRICT`);
    await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_payment_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "booked_seats"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "seat_inventory"`);
    await queryRunner.query(`DROP TABLE "showtimes"`);
    await queryRunner.query(`DROP TABLE "seats"`);
    await queryRunner.query(`DROP TABLE "screens"`);
    await queryRunner.query(`DROP TABLE "movies"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
