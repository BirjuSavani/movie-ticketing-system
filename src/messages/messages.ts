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
