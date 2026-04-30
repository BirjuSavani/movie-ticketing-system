import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "../../config/constants";
import { Booking } from "./Booking";
import { RefreshToken } from "./RefreshToken";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 50, default: "customer" })
  role!: Role;

  @OneToMany(() => Booking, booking => booking.user)
  bookings!: Booking[];

  @OneToMany(() => RefreshToken, token => token.user)
  refreshTokens!: RefreshToken[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
