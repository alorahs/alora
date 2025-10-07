import express from 'express';
import verifyAccessToken from '../middleware/authentication.js';
import { getIO, broadcastNotification, sendNotificationToUser } from '../socket.js';

const router = express.Router();

// Test route to send a notification to all connected users
router.post('/broadcast', verifyAccessToken, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    
    const notification = {
      title: title || 'Test Broadcast',
      message: message || 'This is a test broadcast message',
      type: type || 'info',
      timestamp: new Date()
    };
    
    broadcastNotification(notification);
    
    res.status(200).json({ 
      message: 'Broadcast sent successfully',
      notification 
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test route to send a notification to a specific user
router.post('/send/:userId', verifyAccessToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, message, type } = req.body;
    
    const notification = {
      title: title || 'Direct Message',
      message: message || 'This is a direct message',
      type: type || 'info',
      userId,
      timestamp: new Date()
    };
    
    sendNotificationToUser(userId, notification);
    
    res.status(200).json({ 
      message: 'Direct message sent successfully',
      notification 
    });
  } catch (error) {
    console.error('Error sending direct message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test route to get connected users count
router.get('/stats', verifyAccessToken, async (req, res) => {
  try {
    const connectedUsers = global.connectedUsers ? global.connectedUsers.size : 0;
    
    // Get list of connected user IDs
    const userIds = global.connectedUsers ? Array.from(global.connectedUsers.keys()) : [];
    
    res.status(200).json({ 
      connectedUsers,
      userIds
    });
  } catch (error) {
    console.error('Error getting socket stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;