import { Router } from 'express';
import authRouter from '../modules/auth/router';
import movieRouter from '../modules/movies/router';
import screenRouter from '../modules/screens/router';
import showtimeRouter from '../modules/showtimes/router';
import bookingRouter from '../modules/bookings/router';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/screens', screenRouter);
router.use('/showtimes', showtimeRouter);
router.use('/bookings', bookingRouter);

export default router;
