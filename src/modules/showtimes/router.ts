import { Router } from "express";
import { ROLES } from "../../config/constants";
import { authenticate } from "../../middleware/authenticate";
import { generalRateLimiter } from "../../middleware/rateLimiter";
import { requireRole } from "../../middleware/rbac";
import { validate } from "../../middleware/validate";
import * as showtimeController from "./controller";
import { createShowtimeSchema, getShowtimesFilterSchema, showtimeIdSchema } from "./schema";

const router = Router();

router.use(generalRateLimiter);

// Public routes
router.get("/", validate(getShowtimesFilterSchema, "query"), showtimeController.getAll);

router.get("/:id", validate(showtimeIdSchema, "params"), showtimeController.getById);

router.get("/:id/seats", validate(showtimeIdSchema, "params"), showtimeController.getSeats);

// Admin only routes
router.use(authenticate, requireRole(ROLES.ADMIN));

router.post("/", validate(createShowtimeSchema), showtimeController.create);

export default router;
