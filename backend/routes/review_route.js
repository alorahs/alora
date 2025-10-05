import express from 'express';
import Review from '../models/review.js';
import { isAdmin, isCustomerOrAdmin } from '../middleware/authorization.js';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

// Create a new review (authenticated users only)
router.post('/', verifyAccessToken, async (req, res) => {
  try {
    const { reviewer, reviewee, rating, comment } = req.body;
    console.log(req.body);
    // Validate required fields
    if (!reviewer || !reviewee || !rating) {
      return res.status(400).json({ error: 'Reviewer, reviewee, and rating are required' });
    }
    
    // Validate rating range
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }
    
    // Check if user is trying to review themselves
    if (reviewer === reviewee) {
      return res.status(400).json({ error: 'You cannot review yourself' });
    }
    
    const newReview = new Review({ reviewer, reviewee, rating, comment });
    await newReview.save();
    const populatedReview = await newReview.populate('reviewer reviewee', 'fullName username');
    const professional = await User.findById(reviewee);
    professional.reviews.push(newReview._id);
    professional.ratings.push(rating);
    await professional.save();

    res.status(201).json({ message: 'Review created successfully', review: populatedReview });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all reviews (public access)
router.get('/', async (req, res) => {
  try {
    // If professionalId query param is provided, filter reviews for that professional
    const { professionalId } = req.query;
    
    let query = {};
    if (professionalId) {
      query.reviewee = professionalId;
    }
    
    const reviews = await Review.find(query).populate('reviewer reviewee', 'fullName username');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific review by ID (public access)
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('reviewer reviewee', 'fullName username');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a review (admin or review owner only)
router.put('/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Validate rating if provided
    if (rating !== undefined && (rating < 0 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }
    
    // Check if user is admin or the reviewer
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (req.user.role !== 'admin' && req.user._id.toString() !== review.reviewer.toString()) {
      return res.status(403).json({ message: 'Access forbidden: You can only update your own reviews' });
    }
    
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true, runValidators: true }
    ).populate('reviewer reviewee', 'fullName username');
    
    res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a review (admin or review owner only)
router.delete('/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    // Check if user is admin or the reviewer
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (req.user.role !== 'admin' && req.user._id.toString() !== review.reviewer.toString()) {
      return res.status(403).json({ message: 'Access forbidden: You can only delete your own reviews' });
    }
    
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;