import express from 'express';
import ReachUs from '../models/reach_us.js';
import { isAdmin } from '../middleware/authorization.js';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

// POST /reachus - Submit a reach us form (public access)
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

// GET /reachus - Retrieve all reach us messages (admin only)
router.get('/', verifyAccessToken, isAdmin, async (req, res) => {
    try {
        const messages = await ReachUs.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching reach us messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific reach us message by ID (admin only)
router.get('/:id', verifyAccessToken, isAdmin, async (req, res) => {
    try {
        const message = await ReachUs.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        
        res.status(200).json(message);
    } catch (error) {
        console.error('Error fetching reach us message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a reach us message (admin only)
router.put('/:id', verifyAccessToken, isAdmin, async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body;
        
        const updatedMessage = await ReachUs.findByIdAndUpdate(
            req.params.id,
            { fullName, email, subject, message },
            { new: true, runValidators: true }
        );
        
        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        
        res.status(200).json({ message: 'Message updated successfully', data: updatedMessage });
    } catch (error) {
        console.error('Error updating reach us message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a reach us message (admin only)
router.delete('/:id', verifyAccessToken, isAdmin, async (req, res) => {
    try {
        const message = await ReachUs.findByIdAndDelete(req.params.id);
        
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting reach us message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;