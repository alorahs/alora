import express from 'express';
import ReachUs from '../models/reach_us.js';

const router = express.Router();

// POST /reachus - Submit a reach us form
router.post('/', async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body;
        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newReachUs = new ReachUs({
            fullName,
            email,
            subject,
            message
        });

        await newReachUs.save();
        res.status(200).json({ message: 'Your message has been sent successfully' });
    } catch (error) {
        console.error('Error submitting reach us form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const messages = await ReachUs.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching reach us messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;