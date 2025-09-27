import express from 'express';
import Feedback from '../models/feedback.js';
import { isAdmin } from '../middleware/authorization.js';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

// POST /feedback - Submit feedback (public access)
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

// GET /feedback - Retrieve all feedback (admin only)
router.get('/', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific feedback by ID (admin only)
router.get('/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update feedback (admin only)
router.put('/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { rating, subject, message } = req.body;
    
    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }
    
    // Validate subject if provided
    if (subject && (subject.length < 3 || subject.length > 100)) {
      return res.status(400).json({ error: 'Subject must be between 3 and 100 characters' });
    }
    
    // Validate message if provided
    if (message && (message.length < 10 || message.length > 5000)) {
      return res.status(400).json({ error: 'Message must be between 10 and 5000 characters' });
    }
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { rating, subject, message },
      { new: true, runValidators: true }
    );
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json({ message: 'Feedback updated successfully', feedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete feedback (admin only)
router.delete('/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;