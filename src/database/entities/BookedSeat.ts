import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Booking } from './Booking';
import { SeatInventory } from './SeatInventory';

@Entity('booked_seats')
@Unique(['bookingId', 'seatInventoryId'])
export class BookedSeat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  bookingId!: string;

  @ManyToOne(() => Booking, booking => booking.bookedSeats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking!: Booking;

  @Column({ type: 'uuid' })
  seatInventoryId!: string;

  @ManyToOne(() => SeatInventory, inventory => inventory.bookedSeats, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'seatInventoryId' })
  seatInventory!: SeatInventory;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
