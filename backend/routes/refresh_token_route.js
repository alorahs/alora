import express from 'express';
import RefreshToken from '../models/refresh_token.js';
import { isAdmin } from '../middleware/authorization.js';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

// Get all refresh tokens (admin only)
router.get('/', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const tokens = await RefreshToken.find().populate('user', 'username email');
    res.status(200).json(tokens);
  } catch (error) {
    console.error('Error fetching refresh tokens:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific refresh token by ID (admin only)
router.get('/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const token = await RefreshToken.findById(req.params.id).populate('user', 'username email');
    
    if (!token) {
      return res.status(404).json({ message: 'Refresh token not found' });
    }
    
    res.status(200).json(token);
  } catch (error) {
    console.error('Error fetching refresh token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a refresh token (revoke) (admin or token owner)
router.delete('/:id', verifyAccessToken, async (req, res) => {
  try {
    const token = await RefreshToken.findById(req.params.id);
    
    if (!token) {
      return res.status(404).json({ message: 'Refresh token not found' });
    }
    
    // Check if user is admin or the token owner
    if (req.user.role !== 'admin' && req.user._id.toString() !== token.user.toString()) {
      return res.status(403).json({ message: 'Access forbidden: You can only revoke your own tokens' });
    }
    
    await RefreshToken.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Refresh token revoked successfully' });
  } catch (error) {
    console.error('Error revoking refresh token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;