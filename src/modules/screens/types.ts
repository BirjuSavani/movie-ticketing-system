import { SEAT_TYPES } from "../../config/constants";

export type SeatType = (typeof SEAT_TYPES)[keyof typeof SEAT_TYPES];

export type RowTypeMapping = Record<string, SeatType>;

export interface CreateScreenDto {
  name: string;
  totalSeats: number;
  rows: number;
  seatsPerRow: number;
  rowTypeMapping: RowTypeMapping;
  isActive?: boolean;
}
