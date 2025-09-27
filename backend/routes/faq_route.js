import express from 'express';
import FAQ from '../models/faq.js';

const router = express.Router();

// Create a new FAQ
router.post('/', async (req, res) => {
  try {
    const { type, question, answer } = req.body;
    const newFAQ = new FAQ({ type, question, answer });
    await newFAQ.save();
    res.status(201).json({ message: 'FAQ created successfully', faq: newFAQ });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;