import Joi from "joi";

export const reserveSeatsSchema = Joi.object({
  showtimeId: Joi.string().trim().uuid().required().messages({
    "string.empty": "Showtime ID is required",
    "string.uuid": "Invalid showtime ID format",
    "any.required": "Showtime ID is required",
  }),

  seatIds: Joi.array()
    .items(
      Joi.string().trim().uuid().required().messages({
        "string.base": "Seat ID must be a string",
        "string.empty": "Seat ID cannot be empty",
        "string.uuid": "Invalid seat ID format",
        "any.required": "Seat ID is required",
      })
    )
    .min(1)
    .max(10)
    .required()
    .messages({
      "array.base": "Seat IDs must be an array",
      "array.min": "At least 1 seat must be selected",
      "array.max": "You can book maximum 10 seats at a time",
      "any.required": "Seat IDs are required",
    }),
});

export const confirmBookingSchema = Joi.object({
  paymentMethod: Joi.string().valid("card", "upi", "netbanking").required().messages({
    "any.only": "Payment method must be card, upi, or netbanking",
    "any.required": "Payment method is required",
  }),

  cardLastFour: Joi.string()
    .length(4)
    .pattern(/^[0-9]{4}$/)
    .when("paymentMethod", {
      is: "card",
      then: Joi.required(),
      otherwise: Joi.optional().allow(null),
    })
    .messages({
      "string.length": "Card last 4 digits must be exactly 4 numbers",
      "string.pattern.base": "Card last 4 digits must contain only numbers",
      "any.required": "Card last 4 digits are required for card payment",
    }),
});

export const bookingIdSchema = Joi.object({
  id: Joi.string().trim().uuid().required().messages({
    "string.empty": "Booking ID is required",
    "string.uuid": "Invalid booking ID format",
    "any.required": "Booking ID is required",
  }),
});
