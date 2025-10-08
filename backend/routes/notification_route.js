import express from 'express';
import verifyAccessToken from '../middleware/authentication.js';
import Notification from '../models/notification.js';
// Import the getIO function
import { getIO } from '../socket.js';

const router = express.Router();

// Get notifications for the authenticated user
router.get('/', verifyAccessToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, read, archived } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { user: req.user._id };
    if (read !== undefined) query.read = read === 'true';
    if (archived !== undefined) query.archived = archived === 'true';
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments(query);
    
    res.status(200).json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get unread notifications count
router.get('/unread-count', verifyAccessToken, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      user: req.user._id, 
      read: false,
      archived: false
    });
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
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
      { read: true, readAt: new Date() },
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

// Mark a notification as archived
router.put('/:id/archive', verifyAccessToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { archived: true, archivedAt: new Date() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({ message: 'Notification archived successfully', notification });
  } catch (error) {
    console.error('Error archiving notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/read-all', verifyAccessToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Archive all read notifications
router.put('/archive-all-read', verifyAccessToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: true, archived: false },
      { archived: true, archivedAt: new Date() }
    );
    
    res.status(200).json({ message: 'All read notifications archived' });
  } catch (error) {
    console.error('Error archiving all read notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a notification
router.delete('/:id', verifyAccessToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a notification (internal use)
export const createNotification = async (userId, title, message, type = 'info', options = {}) => {
  try {
    const {
      url = null,
      actionUrl = null,
      actionText = null,
      relatedEntity = null,
      metadata = null,
      channels = ['in-app'],
      priority = 'medium',
      scheduledFor = null
    } = options;
    
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      url,
      actionUrl,
      actionText,
      relatedEntity,
      metadata,
      channels,
      priority,
      scheduledFor
    });
    
    const savedNotification = await notification.save();
    
    // Emit real-time notification via WebSocket if user is connected and notification is not scheduled
    if (!scheduledFor) {
      const io = getIO();
      const socketId = global.connectedUsers?.get(userId.toString());
      if (socketId) {
        // Fetch the full notification with populated fields
        const fullNotification = await Notification.findById(savedNotification._id);
        io.to(socketId).emit('newNotification', fullNotification);
      }
    }
    
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export default router;