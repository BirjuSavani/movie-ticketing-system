import { Router } from "express";
import { ROLES } from "../../config/constants";
import { authenticate } from "../../middleware/authenticate";
import { generalRateLimiter } from "../../middleware/rateLimiter";
import { requireRole } from "../../middleware/rbac";
import { validate } from "../../middleware/validate";
import * as screenController from "./controller";
import { createScreenSchema, screenIdSchema } from "./schema";

const router = Router();

router.use(generalRateLimiter);
router.use(authenticate, requireRole(ROLES.ADMIN));

router.post("/", validate(createScreenSchema), screenController.create);

router.get("/", screenController.getAll);

router.get("/:id", validate(screenIdSchema, "params"), screenController.getById);

export default router;
