import express from 'express';
import shareUserRoute from './share_user.js';
import ReachUsRoute from './reachus_route.js';
import feedbackRoute from './feedback_route.js';
import faqRoute from './faq_route.js';

const router = express.Router();

router.use('/users', shareUserRoute);
router.use('/reachus', ReachUsRoute);
router.use('/feedback', feedbackRoute);
router.use('/faqs', faqRoute);


export default router;