export interface CreateShowtimeDto {
  movieId: string;
  screenId: string;
  startsAt: string;
  endsAt: string;
  basePrice: number;
}

export interface GetShowtimesFilterDto {
  movieId?: string;
  screenId?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export interface ShowtimeSeatDto {
  id: string;
  seatId: string;
  row: string;
  number: number;
  label: string;
  type: string;
  status: string;
  heldUntil?: Date | null;
  price: number;
}
