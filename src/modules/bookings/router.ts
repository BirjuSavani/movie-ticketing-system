import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { bookingRateLimiter } from "../../middleware/rateLimiter";
import { validate } from "../../middleware/validate";
import * as bookingController from "./controller";
import { bookingIdSchema, confirmBookingSchema, reserveSeatsSchema } from "./schema";

const router = Router();

router.use(authenticate);
router.use(bookingRateLimiter);

router.post("/reserve", validate(reserveSeatsSchema), bookingController.reserve);

router.post(
  "/:id/confirm",
  validate(bookingIdSchema, "params"),
  validate(confirmBookingSchema),
  bookingController.confirm
);

router.delete("/:id", validate(bookingIdSchema, "params"), bookingController.cancel);

router.get("/my", bookingController.getMyBookings);

router.get("/:id", validate(bookingIdSchema, "params"), bookingController.getById);

export default router;
