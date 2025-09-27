import express from 'express';
import Feedback from '../models/feedback.js';

const router = express.Router();

// POST /feedback - Submit feedback
router.post('/', async (req, res) => {
  try {
    const { rating, subject, message } = req.body;
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }
    if (subject && (subject.length < 3 || subject.length > 100)) {
      return res.status(400).json({ error: 'Subject must be between 3 and 100 characters' });
    }
    if (message && (message.length < 10 || message.length > 5000)) {
      return res.status(400).json({ error: 'Message must be between 10 and 5000 characters' });
    }
    const feedback = new Feedback({ rating, subject, message });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /feedback - Retrieve all feedback
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;