import { Router } from "express";
import { ROLES } from "../../config/constants";
import { authenticate } from "../../middleware/authenticate";
import { generalRateLimiter } from "../../middleware/rateLimiter";
import { requireRole } from "../../middleware/rbac";
import { validate } from "../../middleware/validate";
import * as movieController from "./controller";
import {
  createMovieSchema,
  getMoviesFilterSchema,
  movieIdSchema,
  updateMovieSchema,
} from "./schema";

const router = Router();

router.use(generalRateLimiter);

// Public routes
router.get("/", validate(getMoviesFilterSchema, "query"), movieController.getAll);

router.get("/:id", validate(movieIdSchema, "params"), movieController.getById);

// Admin only routes
router.use(authenticate, requireRole(ROLES.ADMIN));

router.post("/", validate(createMovieSchema), movieController.create);

router.patch(
  "/:id",
  validate(movieIdSchema, "params"),
  validate(updateMovieSchema),
  movieController.update
);

router.delete("/:id", validate(movieIdSchema, "params"), movieController.deleteMovie);

export default router;
