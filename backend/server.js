import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Import models to ensure they're registered with Mongoose
import './models/user.js';
import './models/faq.js';
import './models/feedback.js';
import './models/reach_us.js';
import './models/review.js';
import './models/refresh_token.js';
import './models/booking.js';
import './models/favorite.js';

import connectDB from './config/db.js';
import apiRouter from './routes/api_route.js';

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || ['http://localhost:8080', 'http://localhost:8000', "http://10.244.78.2:8000", 'http://192.168.29.106:8000', 'https://51090895-ce0d-4997-9b08-6afe46072bdb.lovableproject.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 86400, // cache preflight response for 1 day
}));


// API Routes - keep before frontend static serving
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.json({'message': 'Welcome to the API', 'status': 'running', 'version': '1.0.0', 'author': 'Alora', 'req': req.method + ' ' + req.originalUrl});
});

// Health check route
app.get('/health', (req, res) => {
    const connectionState = mongoose.connection.readyState;
    const statusMap = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting',
    };

    res.status(200).json({
        status: 'OK',
        dbStatus: statusMap[connectionState] || 'Unknown',
    });
});


// 404 handler (after all routes)
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} does not exist`,
    });
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

startServer();