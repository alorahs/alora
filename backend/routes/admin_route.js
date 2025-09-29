import express from 'express';
import User from '../models/user.js';
import Service from '../models/service.js';
import Booking from '../models/booking.js';
import FAQ from '../models/faq.js';
import Feedback from '../models/feedback.js';
import Review from '../models/review.js';
import ReachUs from '../models/reach_us.js';
import { isAdmin } from '../middleware/authorization.js';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

// ===========================================
// DASHBOARD STATISTICS
// ===========================================

// Get admin dashboard statistics
router.get('/stats', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProfessionals,
      totalCustomers,
      totalAdmins,
      totalServices,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalFAQs,
      totalFeedback,
      totalReviews,
      totalMessages
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'professional' }),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'admin' }),
      Service.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      FAQ.countDocuments(),
      Feedback.countDocuments(),
      Review.countDocuments(),
      ReachUs.countDocuments()
    ]);

    // Get recent activities
    const recentBookings = await Booking.find()
      .populate('user', 'fullName email')
      .populate('professional', 'fullName category')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('fullName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate average rating from feedback
    const avgFeedbackRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    const avgReviewRating = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    // Calculate booking rating statistics
    const bookingRatings = await Booking.aggregate([
      { $match: { rating: { $exists: true } } },
      { $group: { 
        _id: null, 
        avgRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating"
        }
      }}
    ]);

    // Process rating distribution
    let ratingDistribution = {};
    if (bookingRatings.length > 0) {
      const ratings = bookingRatings[0].ratingDistribution;
      ratingDistribution = {
        1: ratings.filter(r => r === 1).length,
        2: ratings.filter(r => r === 2).length,
        3: ratings.filter(r => r === 3).length,
        4: ratings.filter(r => r === 4).length,
        5: ratings.filter(r => r === 5).length
      };
    }

    res.status(200).json({
      stats: {
        users: {
          total: totalUsers,
          professionals: totalProfessionals,
          customers: totalCustomers,
          admins: totalAdmins
        },
        services: {
          total: totalServices
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        },
        content: {
          faqs: totalFAQs,
          feedback: totalFeedback,
          reviews: totalReviews,
          messages: totalMessages
        },
        ratings: {
          avgFeedback: avgFeedbackRating[0]?.avgRating || 0,
          avgReview: avgReviewRating[0]?.avgRating || 0,
          avgBooking: bookingRatings[0]?.avgRating || 0,
          totalBookingRatings: bookingRatings[0]?.totalRatings || 0,
          bookingDistribution: ratingDistribution
        }
      },
      recentActivity: {
        bookings: recentBookings,
        users: recentUsers
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===========================================
// USER MANAGEMENT (Enhanced)
// ===========================================

// Get all users with pagination and filtering
router.get('/users', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user (Enhanced)
router.delete('/users/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Delete related data
    await Promise.all([
      Booking.deleteMany({ $or: [{ user: userId }, { professional: userId }] }),
      Review.deleteMany({ $or: [{ reviewer: userId }, { reviewee: userId }] })
    ]);

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk update users
router.patch('/users/bulk', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { userIds, updates } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: updates }
    );

    res.status(200).json({ 
      message: 'Users updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error bulk updating users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===========================================
// FEEDBACK MANAGEMENT (Enhanced)
// ===========================================

// Get all feedback with pagination
router.get('/feedback', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query = {};

    if (rating) query.rating = parseInt(rating);

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const feedback = await Feedback.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      feedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update feedback
router.put('/feedback/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { rating, subject, message } = req.body;
    
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
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete feedback
router.delete('/feedback/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===========================================
// REVIEW MANAGEMENT (Enhanced)
// ===========================================

// Get all reviews with pagination
router.get('/reviews', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query = {};

    if (rating) query.rating = parseInt(rating);

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find(query)
      .populate('reviewer', 'fullName email')
      .populate('reviewee', 'fullName email category')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update review
router.put('/reviews/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true, runValidators: true }
    ).populate('reviewer reviewee', 'fullName email');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete review
router.delete('/reviews/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===========================================
// BOOKING MANAGEMENT (Enhanced)
// ===========================================

// Get all bookings with enhanced filtering
router.get('/bookings', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      dateFrom, 
      dateTo, 
      service,
      hasRating, // New filter for ratings
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};

    if (status) query.status = status;
    if (service) query.service = { $regex: service, $options: 'i' };
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }
    // Filter for bookings with or without ratings
    if (hasRating === 'true') {
      query.rating = { $exists: true };
    } else if (hasRating === 'false') {
      query.rating = { $exists: false };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bookings = await Booking.find(query)
      .populate('user', 'fullName email phone')
      .populate('professional', 'fullName email category hourlyRate')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get booking ratings statistics
router.get('/bookings/ratings', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    // Get all bookings with ratings
    const bookingsWithRatings = await Booking.find({ rating: { $exists: true } })
      .populate('user', 'fullName email')
      .populate('professional', 'fullName category');

    // Calculate statistics
    const totalRatings = bookingsWithRatings.length;
    
    if (totalRatings === 0) {
      return res.status(200).json({
        statistics: {
          average: 0,
          total: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        },
        bookings: []
      });
    }

    // Calculate average rating
    const sumRatings = bookingsWithRatings.reduce((sum, booking) => sum + booking.rating, 0);
    const averageRating = sumRatings / totalRatings;

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    bookingsWithRatings.forEach(booking => {
      distribution[booking.rating]++;
    });

    res.status(200).json({
      statistics: {
        average: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
        total: totalRatings,
        distribution
      },
      bookings: bookingsWithRatings
    });
  } catch (error) {
    console.error('Error fetching booking ratings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update booking status (Admin can update any booking)
router.patch('/bookings/:id/status', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user professional', 'fullName email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete booking
router.delete('/bookings/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===========================================
// SYSTEM ACTIONS
// ===========================================

// Get system health
router.get('/system/health', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const [userCount, serviceCount, bookingCount] = await Promise.all([
      User.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments()
    ]);

    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      counts: {
        users: userCount,
        services: serviceCount,
        bookings: bookingCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ===========================================
// MESSAGE MANAGEMENT (Enhanced)
// ===========================================

// Get all contact messages with pagination
router.get('/messages', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const messages = await ReachUs.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ReachUs.countDocuments(query);

    res.status(200).json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete message
router.delete('/messages/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const message = await ReachUs.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;