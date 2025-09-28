import express from 'express';
import userRouter from './user_route.js';
import shareRouter from './share_route.js';
import authRouter from './auth_route.js';
import faqRouter from './faq_route.js';
import feedbackRouter from './feedback_route.js';
import reachUsRouter from './reachus_route.js';
import reviewRouter from './review_route.js';
import refreshTokenRouter from './refresh_token_route.js';
import bookingRouter from './booking_route.js';
import favoriteRouter from './favorite_route.js';
import notificationRouter from './notification_route.js';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/_', shareRouter);
router.use('/user', verifyAccessToken, userRouter);
router.use('/faq', faqRouter);
router.use('/feedback', feedbackRouter);
router.use('/reachus', reachUsRouter);
router.use('/review', verifyAccessToken, reviewRouter);
router.use('/booking', verifyAccessToken, bookingRouter);
router.use('/favorite', verifyAccessToken, favoriteRouter);
router.use('/notification', verifyAccessToken, notificationRouter);
router.use('/refresh-token', verifyAccessToken, refreshTokenRouter);

router.get('/', (req, res) => {
  res.json({
    message: 'API Root - Available endpoints: /auth, /user, /faq, /feedback, /reachus, /review, /booking, /favorite, /notification, /refresh-token',
    status: 'running',
    version: '1.0.0',
  });
});

export default router;