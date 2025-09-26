import express from 'express';
import shareUserRoute from './share_user.js';
import ReachUsRoute from './reachus_route.js';

const router = express.Router();

router.use('/users', shareUserRoute);
router.use('/reachus', ReachUsRoute);


export default router;