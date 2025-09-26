import express from 'express';
import userRouter from './user_route.js';

const router = express.Router();

router.use('/user', userRouter);

export default router;