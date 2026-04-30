import { Router } from 'express';
import * as authController from './controller';
import { authRateLimiter } from '../../middleware/rateLimiter';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema, refreshSchema } from './schema';

const router = Router();

// Apply rate limiter to auth routes
router.use(authRateLimiter);

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', authController.logout);

export default router;
