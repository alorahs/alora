import express from 'express';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

// In a real implementation, this would connect to a database
// For now, we'll simulate notifications

// Get notifications for the authenticated user
router.get('/', verifyAccessToken, async (req, res) => {
  try {
    // Simulate notifications
    const notifications = [
      {
        id: "1",
        title: "Booking Confirmed",
        message: "Your booking with Rajesh Kumar has been confirmed for June 20, 2023 at 2:00 PM.",
        type: "success",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: false
      },
      {
        id: "2",
        title: "New Message",
        message: "Priya Sharma sent you a message about your electrical work booking.",
        type: "info",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true
      },
      {
        id: "3",
        title: "Payment Successful",
        message: "Your payment of ₹450 has been processed successfully.",
        type: "success",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        read: true
      }
    ];
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark a notification as read
router.put('/:id/read', verifyAccessToken, async (req, res) => {
  try {
    // In a real implementation, this would update the notification in the database
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/read-all', verifyAccessToken, async (req, res) => {
  try {
    // In a real implementation, this would update all notifications for the user
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;