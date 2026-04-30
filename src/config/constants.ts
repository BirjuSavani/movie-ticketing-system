export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const SEAT_TYPES = {
  STANDARD: 'standard',
  PREMIUM: 'premium',
  VIP: 'vip'
} as const;

export type SeatType = typeof SEAT_TYPES[keyof typeof SEAT_TYPES];

export const SEAT_STATUS = {
  AVAILABLE: 'available', // seat is available for booking
  HELD: 'held', // seat is temporarily held during the reservation process
  BOOKED: 'booked' // seat is booked and confirmed after successful payment
} as const;

export type SeatStatus = typeof SEAT_STATUS[keyof typeof SEAT_STATUS];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded'
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

export const MOVIE_RATINGS = {
  U: 'U', // universal, suitable for all ages
  UA: 'UA', // parental guidance for children below 12 years
  A: 'A' // adults only, suitable for 18 years and above
} as const;

export type MovieRating = typeof MOVIE_RATINGS[keyof typeof MOVIE_RATINGS];
