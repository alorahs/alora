import express from 'express';
import FAQ from '../models/faq.js';
import { isAdmin } from '../middleware/authorization.js';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

// Create a new FAQ (admin only)
router.post('/', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { type, question, answer } = req.body;
    
    // Validate required fields
    if (!type || !question || !answer) {
      return res.status(400).json({ error: 'Type, question, and answer are required' });
    }
    
    const newFAQ = new FAQ({ type, question, answer });
    await newFAQ.save();
    
    res.status(201).json({ message: 'FAQ created successfully', faq: newFAQ });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all FAQs (public access)
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific FAQ by ID (public access)
router.get('/:id', async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    res.status(200).json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an FAQ (admin only)
router.put('/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { type, question, answer } = req.body;
    
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { type, question, answer },
      { new: true, runValidators: true }
    );
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    res.status(200).json({ message: 'FAQ updated successfully', faq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an FAQ (admin only)
router.delete('/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;