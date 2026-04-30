import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PaymentStatus } from "../../config/constants";
import { Booking } from "./Booking";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  bookingId!: string;

  @OneToOne(() => Booking, booking => booking.payment, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bookingId" })
  booking!: Booking;

  @Column({ type: "varchar", length: 20 })
  status!: PaymentStatus;

  @Column({ type: "varchar", length: 100 })
  paymentMethod!: string;

  @Column({ type: "varchar", length: 4 })
  cardLastFour!: string;

  @Column({ type: "varchar", length: 50, unique: true })
  bookingReference!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
