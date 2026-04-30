import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SeatStatus } from "../../config/constants";
import { BookedSeat } from "./BookedSeat";
import { Seat } from "./Seat";
import { Showtime } from "./Showtime";

@Entity("seat_inventory")
@Index(["showtimeId", "status"])
@Index("unique_active_seat", ["showtimeId", "seatId"], {
  unique: true,
  where: "status IN ('held', 'booked')",
})
export class SeatInventory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  seatId!: string;

  @ManyToOne(() => Seat, seat => seat.inventories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "seatId" })
  seat!: Seat;

  @Column({ type: "uuid" })
  showtimeId!: string;

  @ManyToOne(() => Showtime, showtime => showtime.seatInventories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "showtimeId" })
  showtime!: Showtime;

  @Column({ type: "varchar", length: 20, default: "available" })
  status!: SeatStatus;

  @Column({ type: "timestamptz", nullable: true })
  heldUntil!: Date | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => BookedSeat, bookedSeat => bookedSeat.seatInventory)
  bookedSeats!: BookedSeat[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
