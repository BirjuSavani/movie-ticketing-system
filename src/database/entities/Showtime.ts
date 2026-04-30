import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from './Booking';
import { Movie } from './Movie';
import { Screen } from './Screen';
import { SeatInventory } from './SeatInventory';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  movieId!: string;

  @ManyToOne(() => Movie, movie => movie.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie!: Movie;

  @Column({ type: 'uuid' })
  screenId!: string;

  @ManyToOne(() => Screen, screen => screen.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'screenId' })
  screen!: Screen;

  @Column({ type: 'timestamptz' })
  startsAt!: Date;

  @Column({ type: 'timestamptz' })
  endsAt!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice!: number;

  @OneToMany(() => SeatInventory, inventory => inventory.showtime)
  seatInventories!: SeatInventory[];

  @OneToMany(() => Booking, booking => booking.showtime)
  bookings!: Booking[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
