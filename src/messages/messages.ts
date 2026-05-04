// export const MESSAGES = {
//   AUTH: {
//     REGISTER_SUCCESS: "User registered successfully",
//     LOGIN_SUCCESS: "Logged in successfully",
//     REFRESH_SUCCESS: "Token refreshed successfully",
//     LOGOUT_SUCCESS: "Logged out successfully",
//     EMAIL_IS_ALREADY_REGISTERED: "Email is already registered",
//     INVALID: "Invalid credentials",
//     INVALID_TOKEN: "Invalid or expired token",
//     INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
//   },
//   MOVIE: {
//     CREATE_SUCCESS: "Movie created successfully",
//     UPDATE_SUCCESS: "Movie updated successfully",
//     DELETE_SUCCESS: "Movie deleted successfully",
//     FETCH_SUCCESS: "Movies retrieved successfully",
//   },
//   SCREEN: {
//     CREATE_SUCCESS: "Screen created successfully",
//     FETCH_SUCCESS: "Screens retrieved successfully",
//   },
//   SHOWTIME: {
//     CREATE_SUCCESS: "Showtime created successfully",
//     FETCH_SUCCESS: "Showtimes retrieved successfully",
//   },
//   BOOKING: {
//     RESERVE_SUCCESS: "Seats reserved successfully",
//     CONFIRM_SUCCESS: "Booking confirmed successfully",
//     CANCEL_SUCCESS: "Booking cancelled successfully",
//     FETCH_SUCCESS: "Bookings retrieved successfully",
//     INVALID_SEATS: "One or more seats are invalid for this showtime. Please select valid seats.",
//     INVALID_SEATS_AVAILABLE: "One or more selected seats are no longer available.",
//     BOOKING_NOT_FOUND: "Booking not found.",
//     FORBIDDEN:'You do not have permission to confirm this booking.',
//     BOOKING_EXPIRED:'Booking hold has expired and cannot be confirmed.',
//     HIGH_CONTENTION: 'System is currently processing another request for these seats. Please try again in a moment.',
//     SHOWTIME_EXPIRED: 'This showtime has already started or ended. Booking is no longer available.'
//   },
// };

// export const ERROR_MESSAGES = {
//   NOT_FOUND: "Resource not found",
//   VALIDATION_ERROR: "Invalid request data",
//   CONFLICT: "A conflict occurred",
//   INTERNAL_SERVER_ERROR: "An unexpected error occurred",
//   SEAT_UNAVAILABLE: "One or more selected seats are no longer available.",
//   BOOKING_EXPIRED: "Booking hold period has expired.",
//   HOLD_CONFLICT: "Concurrency conflict occurred during seat reservation.",
//   UNAUTHORIZED: "Missing or invalid token.",
//   FORBIDDEN: "Access denied.",
// };
export const MESSAGES = {
  AUTH: {
    SUCCESS: {
      REGISTER: "User registered successfully",
      LOGIN: "Logged in successfully",
      REFRESH: "Token refreshed successfully",
      LOGOUT: "Logged out successfully",
    },
    ERROR: {
      EMAIL_ALREADY_REGISTERED: "Email is already registered",
      INVALID_CREDENTIALS: "Invalid credentials",
      INVALID_TOKEN: "Invalid or expired token",
      INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
    },
  },

  MOVIE: {
    SUCCESS: {
      CREATE: "Movie created successfully",
      UPDATE: "Movie updated successfully",
      DELETE: "Movie deleted successfully",
      FETCH: "Movies retrieved successfully",
    },
    ERROR: {
      ALREADY_EXISTS: "A movie with the same title already exists",
      NO_FIELDS: "No fields provided for update request",
      NOT_FOUND: "Movie not found",
      ALREADY_DELETED: "Movie has already been deleted",
    },
  },

  BOOKING: {
    SUCCESS: {
      RESERVE: "Seats reserved successfully",
      CONFIRM: "Booking confirmed successfully",
      CANCEL: "Booking cancelled successfully",
      FETCH: "Bookings retrieved successfully",
    },
    ERROR: {
      INVALID_SEATS: "One or more seats are invalid for this showtime",
      SEAT_UNAVAILABLE: "One or more selected seats are no longer available",
      NOT_FOUND: "Booking not found",
      FORBIDDEN: "You do not have permission to confirm this booking",
      EXPIRED: "Booking hold has expired",
      HIGH_CONTENTION: "System is busy. Please try again shortly",
      SHOWTIME_EXPIRED: "This showtime is no longer available",
    },
  },

  SCREEN: {
    SUCCESS: {
      CREATE: "Screen created successfully",
      FETCH: "Screens retrieved successfully",
    },
    ERROR: {
      NOT_FOUND: "Screen not found",
      ALREADY_EXISTS: "A screen with the same name already exists",
      INVALID_SEAT_CONFIGURATION:
        "Invalid seat configuration: totalSeats does not match rows * seatsPerRow",
    },
  },

  SHOWTIME: {
    SUCCESS: {
      CREATE: "Showtime created successfully",
      FETCH: "Showtimes retrieved successfully",
    },
    ERROR: {
      NOT_FOUND: "Showtime not found",
      ALREADY_EXISTS: "A showtime for this movie and screen already exists",
      OVERLAP: "Showtime overlaps with an existing showtime on this screen",
    },
  },

  COMMON: {
    ERROR: {
      NOT_FOUND: "Resource not found",
      VALIDATION: "Invalid request data",
      CONFLICT: "A conflict occurred",
      INTERNAL: "An unexpected error occurred",
      UNAUTHORIZED: "Missing or invalid token",
      FORBIDDEN: "Access denied",
    },
  },
} as const;
