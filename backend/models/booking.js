import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  hourlyRate: {
    type: Number
  },
  totalPrice: {
    type: Number
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
bookingSchema.index({ user: 1 });
bookingSchema.index({ professional: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1 });

export default mongoose.model('Booking', bookingSchema);