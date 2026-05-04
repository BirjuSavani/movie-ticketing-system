import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Seat } from './Seat';
import { Showtime } from './Showtime';

@Entity("screens")
export class Screen {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "int" })
  totalSeats!: number;

  @Column({ type: "int" })
  rows!: number;

  @Column({ type: "int" })
  seatsPerRow!: number;

  @Column({ type: "jsonb" })
  rowTypeMapping!: Record<string, string>;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => Seat, seat => seat.screen, { cascade: true })
  seats!: Seat[];

  @OneToMany(() => Showtime, showtime => showtime.screen)
  showtimes!: Showtime[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
