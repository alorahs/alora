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
  professionalProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
  },
  duration: {
    type: Number, // in minutes
    min: 15,
    max: 480,
    default: 60
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, match: [/^[0-9]{5,10}$/, 'Invalid zip code'] },
    country: { type: String, default: 'India' }
  },
  notes: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected', 'rescheduled'],
    default: 'pending'
  },
  cancellationReason: {
    type: String,
    maxlength: 200
  },
  hourlyRate: {
    type: Number,
    min: 0,
    default: 0
  },
  totalPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'paypal', 'bank-transfer', 'cash', 'upi']
  },
  transactionId: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
bookingSchema.index({ user: 1 });
bookingSchema.index({ professional: 1 });
bookingSchema.index({ professionalProfile: 1 });
bookingSchema.index({ service: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for booking reference number
bookingSchema.virtual('referenceNumber').get(function() {
  return `BK-${this._id.toString().substring(0, 8).toUpperCase()}`;
});

// Virtual for full address
bookingSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zip}`;
});

// Virtual for booking status display
bookingSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending Confirmation',
    'confirmed': 'Confirmed',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'rejected': 'Rejected',
    'rescheduled': 'Rescheduled'
  };
  return statusMap[this.status] || this.status;
});

export default mongoose.model('Booking', bookingSchema);