export interface ReserveSeatsDto {
  showtimeId: string;
  seatIds: string[];
}

export type PaymentMethod = "card" | "upi" | "netbanking";

export interface ConfirmBookingDto {
  paymentMethod: PaymentMethod;
  cardLastFour?: string | null;
}
