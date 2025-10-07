import express from 'express';
import verifyAccessToken from '../middleware/authentication.js';
import Notification from '../models/notification.js';
// Import the getIO function
import { getIO } from '../socket.js';

const router = express.Router();

// Get notifications for the authenticated user
router.get('/', verifyAccessToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark a notification as read
router.put('/:id/read', verifyAccessToken, async (req, res) => {
  try {
    // Check if ID is provided
    if (!req.params.id) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }
    
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/read-all', verifyAccessToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a notification (internal use)
export const createNotification = async (userId, title, message, type = 'info', url = null) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      url
    });
    
    const savedNotification = await notification.save();
    
    // Emit real-time notification via WebSocket if user is connected
    const io = getIO();
    const socketId = global.connectedUsers?.get(userId.toString());
    if (socketId) {
      // Fetch the full notification with populated fields
      const fullNotification = await Notification.findById(savedNotification._id);
      io.to(socketId).emit('newNotification', fullNotification);
    }
    
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export default router;