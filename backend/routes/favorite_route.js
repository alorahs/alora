import express from 'express';
import Favorite from '../models/favorite.js';
import User from '../models/user.js';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

// Add a professional to favorites
router.post('/', verifyAccessToken, async (req, res) => {
  try {
    const { professionalId } = req.body;
    
    // Verify professional exists and has professional role
    const professional = await User.findById(professionalId);
    if (!professional || professional.role !== 'professional') {
      return res.status(400).json({ message: 'Invalid professional' });
    }
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      professional: professionalId
    });
    
    if (existingFavorite) {
      return res.status(400).json({ message: 'Professional already in favorites' });
    }
    
    // Create favorite
    const favorite = new Favorite({
      user: req.user._id,
      professional: professionalId
    });
    
    const savedFavorite = await favorite.save();
    
    // Populate user and professional details
    await savedFavorite.populate('user', 'fullName');
    await savedFavorite.populate('professional', 'fullName category rating');
    
    res.status(201).json({ message: 'Added to favorites', favorite: savedFavorite });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all favorites for the authenticated user
router.get('/', verifyAccessToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('professional', 'fullName category rating profilePicture phone email');
    
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove a professional from favorites
router.delete('/:professionalId', verifyAccessToken, async (req, res) => {
  try {
    const { professionalId } = req.params;
    
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      professional: professionalId
    });
    
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if a professional is favorited
router.get('/:professionalId', verifyAccessToken, async (req, res) => {
  try {
    const { professionalId } = req.params;
    
    const favorite = await Favorite.findOne({
      user: req.user._id,
      professional: professionalId
    });
    
    res.status(200).json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;