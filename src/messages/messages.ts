export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Logged in successfully",
    REFRESH_SUCCESS: "Token refreshed successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
    EMAIL_IS_ALREADY_REGISTERED: "Email is already registered",
    INVALID: "Invalid credentials",
    INVALID_TOKEN: "Invalid or expired token",
    INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  },
  MOVIE: {
    CREATE_SUCCESS: "Movie created successfully",
    UPDATE_SUCCESS: "Movie updated successfully",
    DELETE_SUCCESS: "Movie deleted successfully",
    FETCH_SUCCESS: "Movies retrieved successfully",
  },
  SCREEN: {
    CREATE_SUCCESS: "Screen created successfully",
    FETCH_SUCCESS: "Screens retrieved successfully",
  },
  SHOWTIME: {
    CREATE_SUCCESS: "Showtime created successfully",
    FETCH_SUCCESS: "Showtimes retrieved successfully",
  },
  BOOKING: {
    RESERVE_SUCCESS: "Seats reserved successfully",
    CONFIRM_SUCCESS: "Booking confirmed successfully",
    CANCEL_SUCCESS: "Booking cancelled successfully",
    FETCH_SUCCESS: "Bookings retrieved successfully",
    INVALID_SEATS: "One or more seats are invalid for this showtime. Please select valid seats.",
    INVALID_SEATS_AVAILABLE: "One or more selected seats are no longer available.",
    BOOKING_NOT_FOUND: "Booking not found.",
    FORBIDDEN:'You do not have permission to confirm this booking.',
    BOOKING_EXPIRED:'Booking hold has expired and cannot be confirmed.',
    HIGH_CONTENTION: 'System is currently processing another request for these seats. Please try again in a moment.',
    SHOWTIME_EXPIRED: 'This showtime has already started or ended. Booking is no longer available.'
  },
};

export const ERROR_MESSAGES = {
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Invalid request data",
  CONFLICT: "A conflict occurred",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred",
  SEAT_UNAVAILABLE: "One or more selected seats are no longer available.",
  BOOKING_EXPIRED: "Booking hold period has expired.",
  HOLD_CONFLICT: "Concurrency conflict occurred during seat reservation.",
  UNAUTHORIZED: "Missing or invalid token.",
  FORBIDDEN: "Access denied.",
};
