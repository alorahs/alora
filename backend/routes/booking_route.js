import express from 'express';
import Booking from '../models/booking.js';
import User from '../models/user.js';
import { body, validationResult } from 'express-validator';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

// Create a new booking
router.post('/', verifyAccessToken, [
  body('professionalId').isMongoId().withMessage('Professional ID must be a valid MongoDB ID'),
  body('service').notEmpty().withMessage('Service is required'),
  body('date').isISO8601().withMessage('Date must be a valid ISO date'),
  body('time').notEmpty().withMessage('Time is required'),
  body('address').isObject().withMessage('Address must be an object'),
  body('notes').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { professionalId, service, date, time, address, notes } = req.body;
    
    // Verify professional exists and has professional role
    const professional = await User.findById(professionalId);
    if (!professional || professional.role !== 'professional') {
      return res.status(400).json({ message: 'Invalid professional' });
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      professional: professionalId,
      service,
      date: new Date(date),
      time,
      address,
      notes,
      status: 'pending'
    });

    const savedBooking = await booking.save();
    
    // Populate user and professional details
    await savedBooking.populate('user', 'fullName email');
    await savedBooking.populate('professional', 'fullName email category');
    
    res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all bookings for the authenticated user
router.get('/', verifyAccessToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('professional', 'fullName category rating')
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific booking by ID
router.get('/:id', verifyAccessToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'fullName email')
      .populate('professional', 'fullName email category rating');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to view this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update booking status (user can cancel, admin/professional can confirm/complete)
router.put('/:id/status', verifyAccessToken, [
  body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Authorization check
    if (req.user.role === 'admin') {
      // Admin can update any booking
    } else if (req.user.role === 'professional' && booking.professional.toString() === req.user._id.toString()) {
      // Professional can only update their own bookings
      if (status !== 'confirmed' && status !== 'completed') {
        return res.status(403).json({ message: 'Professionals can only confirm or complete bookings' });
      }
    } else if (booking.user.toString() === req.user._id.toString()) {
      // User can only cancel their own bookings
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Users can only cancel bookings' });
      }
    } else {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }
    
    booking.status = status;
    const updatedBooking = await booking.save();
    
    // Populate user and professional details
    await updatedBooking.populate('user', 'fullName email');
    await updatedBooking.populate('professional', 'fullName email category');
    
    res.status(200).json({ message: 'Booking status updated', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add rating and review to a completed booking
router.put('/:id/rating', verifyAccessToken, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to rate this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to rate this booking' });
    }
    
    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed bookings' });
    }
    
    booking.rating = rating;
    booking.review = review;
    const updatedBooking = await booking.save();
    
    res.status(200).json({ message: 'Rating added successfully', booking: updatedBooking });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get bookings for a professional
router.get('/professional/:professionalId', verifyAccessToken, async (req, res) => {
  try {
    // Check if user is the professional or admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.professionalId) {
      return res.status(403).json({ message: 'Not authorized to view these bookings' });
    }
    
    const bookings = await Booking.find({ professional: req.params.professionalId })
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching professional bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a booking (only admin)
router.delete('/:id', verifyAccessToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Only admin can delete bookings
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }
    
    await booking.remove();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;