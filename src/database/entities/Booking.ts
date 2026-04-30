import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BookingStatus } from "../../config/constants";
import { BookedSeat } from "./BookedSeat";
import { Payment } from "./Payment";
import { Showtime } from "./Showtime";
import { User } from "./User";

@Entity("bookings")
@Index(["userId", "status"])
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, user => user.bookings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "uuid" })
  showtimeId!: string;

  @ManyToOne(() => Showtime, showtime => showtime.bookings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "showtimeId" })
  showtime!: Showtime;

  @Column({ type: "varchar", length: 20, default: "pending" })
  status!: BookingStatus;

  @Column({ type: "varchar", length: 100, nullable: true, unique: true })
  idempotencyKey!: string | null;

  @OneToMany(() => BookedSeat, bookedSeat => bookedSeat.booking, { cascade: true })
  bookedSeats!: BookedSeat[];

  @OneToOne(() => Payment, payment => payment.booking, { cascade: true })
  payment!: Payment;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
