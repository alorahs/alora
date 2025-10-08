import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Not required for signup OTPs
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address'],
    index: true
  },
  phone: {
    type: String,
    match: [/^[0-9]{10,15}$/, 'Invalid phone number'],
    index: true
  },
  otp: {
    type: String,
    required: true,
    maxlength: 10,
    select: false // Don't include in queries by default for security
  },
  type: {
    type: String,
    enum: ['email-verification', 'phone-verification', 'login', 'password-reset', 'signup'],
    required: true,
    index: true
  },
  purpose: {
    type: String,
    enum: ['verification', 'authentication', 'recovery'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
    // index: true - Removed because we have an explicit index with expireAfterSeconds
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  isUsed: {
    type: Boolean,
    default: false,
    index: true
  },
  usedAt: {
    type: Date,
    default: null
  },
  ipAddress: {
    type: String,
    match: [/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid IP address']
  },
  userAgent: {
    type: String
  },
  // Additional security fields
  sessionId: {
    type: String,
    index: true
  },
  deviceId: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (excluding those already created by field-level indexes)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ createdAt: -1 });
otpSchema.index({ type: 1, isUsed: 1 });

// Virtual for isExpired
otpSchema.virtual('isExpired').get(function() {
  return Date.now() > this.expiresAt;
});

// Virtual for isValid
otpSchema.virtual('isValid').get(function() {
  return !this.isUsed && !this.isExpired && this.attempts < this.maxAttempts;
});

// Virtual for timeRemaining
otpSchema.virtual('timeRemaining').get(function() {
  if (this.isExpired) return 0;
  return Math.max(0, this.expiresAt - Date.now());
});

// Ensure either user or email/phone is provided
otpSchema.pre('validate', function(next) {
  if (!this.user && !this.email && !this.phone) {
    next(new Error('Either user, email, or phone must be provided'));
  } else {
    next();
  }
});

// Set expiration before saving
otpSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Default expiration: 10 minutes
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  }
  next();
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;