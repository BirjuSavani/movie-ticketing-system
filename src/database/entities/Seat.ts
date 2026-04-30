import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SeatType } from "../../config/constants";
import { Screen } from "./Screen";
import { SeatInventory } from "./SeatInventory";

@Entity("seats")
export class Seat {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  screenId!: string;

  @ManyToOne(() => Screen, screen => screen.seats, { onDelete: "CASCADE" })
  @JoinColumn({ name: "screenId" })
  screen!: Screen;

  @Column({ type: "varchar", length: 10 })
  row!: string;

  @Column({ type: "int" })
  number!: number;

  @Column({ type: "varchar", length: 20 })
  seatId!: string; // e.g. A1, J15

  @Column({ type: "varchar", length: 20 })
  type!: SeatType;

  @OneToMany(() => SeatInventory, inventory => inventory.seat)
  inventories!: SeatInventory[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
