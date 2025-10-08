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
import fileRouter from './file_route.js';
import professionalRouter from './professional_route.js';
import userDetailsRouter from './user_details_route.js';
import verifyAccessToken from '../middleware/authentication.js';
import navigationRouter from './navigation_route.js';
import serviceRouter from './service_route.js';
import adminRouter from './admin_route.js';
import aboutUsRouter from './aboutus_route.js';
import verifyApiKey from '../middleware/verify_api_key.js';
// Import socket test router
import socketTestRouter from './socket_test_route.js';
// Import proxy router
import proxyRouter from './proxy_route.js';

const router = express.Router();

router.use('/auth', verifyApiKey, authRouter);
router.use('/_', verifyApiKey, shareRouter);
router.use('/services', verifyApiKey, serviceRouter);
router.use('/user', verifyAccessToken, verifyApiKey, userRouter);
router.use('/user-details', verifyAccessToken, verifyApiKey, userDetailsRouter);
router.use('/professionals', verifyApiKey, professionalRouter);
router.use('/faq', verifyApiKey, faqRouter);
router.use('/feedback', verifyApiKey, feedbackRouter);
router.use('/reachus', verifyApiKey, reachUsRouter);
router.use('/review', verifyAccessToken, verifyApiKey, reviewRouter);
router.use('/booking', verifyAccessToken, verifyApiKey, bookingRouter);
router.use('/favorite', verifyAccessToken, verifyApiKey, favoriteRouter);
router.use('/notification', verifyAccessToken, verifyApiKey, notificationRouter);
router.use('/refresh-token', verifyAccessToken, verifyApiKey, refreshTokenRouter);
router.use('/files', fileRouter);
router.use('/geocode',verifyApiKey, navigationRouter);
router.use('/admin', verifyAccessToken,verifyApiKey, adminRouter);
router.use('/aboutus',verifyApiKey, aboutUsRouter);
// Add socket test route
router.use('/socket-test', verifyAccessToken, socketTestRouter);
// Add proxy route (no API key verification needed as it handles its own)
router.use('/proxy', proxyRouter);

export default router;