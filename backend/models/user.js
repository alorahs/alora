import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    minlength: 3,
    maxlength: 30,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: props => `${props.value} is not a valid username! Only letters, numbers, and underscores are allowed.`
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
  },
  password: { 
    type: String,
    // Not required for OTP-only users
    required: false,
    minlength: 6,
    select: false // Don't include in queries by default
  },
  authMethod: {
    type: String,
    enum: ['password', 'otp-only'],
    default: 'password',
    required: true
  },
  role: { 
    type: String, 
    enum: ['customer', 'professional', 'admin'], 
    default: 'customer', 
    required: true 
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^[0-9]{10,15}$/, 'Invalid phone number']
  },
  fullName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  profilePicture: { 
    type: String,
    default: null
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, match: [/^[0-9]{5,10}$/, 'Invalid pincode'] },
    country: { type: String, default: 'India' },
    lon: { type: Number },
    lat: { type: Number }
  },
  bio: { 
    type: String,
    maxlength: 500
  },
  socialLinks: {
    linkedin: { 
      type: String,
      match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/, 'Invalid LinkedIn URL']
    },
    twitter: { 
      type: String,
      match: [/^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+$/, 'Invalid Twitter/X URL']
    },
    facebook: { 
      type: String,
      match: [/^(https?:\/\/)?(www\.)?facebook\.com\/.+$/, 'Invalid Facebook URL']
    },
    instagram: { 
      type: String,
      match: [/^(https?:\/\/)?(www\.)?instagram\.com\/.+$/, 'Invalid Instagram URL']
    }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  emailVerified: { 
    type: Boolean, 
    default: false 
  },
  phoneVerified: { 
    type: Boolean, 
    default: false 
  },
  resetPasswordToken: { 
    type: String,
    default: null
  },
  resetPasswordExpires: { 
    type: Date,
    default: null
  },
  verifyEmailToken: { 
    type: String,
    default: null
  },
  verifyEmailExpires: { 
    type: Date,
    default: null
  },
  verifyPhoneToken: { 
    type: String,
    default: null
  },
  verifyPhoneExpires: { 
    type: Date,
    default: null
  },
  deletionRequestedAt: { 
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  // References to related models
  userDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails'
  },
  professionalProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional'
  },
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Favorite'
  }],
  reviewsGiven: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  feedbacks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback'
  }],
  reachUsMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReachUs'
  }],
  settings: {
    // Notification preferences
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false },
    bookingReminders: { type: Boolean, default: true },
    reviewNotifications: { type: Boolean, default: true },
    
    // Privacy settings
    profileVisibility: { 
      type: String, 
      enum: ['public', 'private', 'professional-only'], 
      default: 'public' 
    },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    allowDirectMessages: { type: Boolean, default: true },
    
    // App preferences
    theme: { 
      type: String, 
      enum: ['light', 'dark', 'system'], 
      default: 'system' 
    },
    language: { 
      type: String, 
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'hi'] 
    },
    timezone: { 
      type: String, 
      default: 'Asia/Kolkata'
    },
    
    // Security settings
    twoFactorEnabled: { type: Boolean, default: false },
    sessionTimeout: { 
      type: Number, 
      default: 30,
      min: 5,
      max: 120 // in minutes
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('displayName').get(function() {
  return this.fullName || this.username;
});

// Virtual for isProfessional
userSchema.virtual('isProfessional').get(function() {
  return this.role === 'professional';
});

// Virtual for isAdmin
userSchema.virtual('isAdmin').get(function() {
  return this.role === 'admin';
});

// Virtual for isCustomer
userSchema.virtual('isCustomer').get(function() {
  return this.role === 'customer';
});

// Indexes (excluding those already created by unique constraints)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ authMethod: 1 });
userSchema.index({ lastLogin: -1 });

const User = mongoose.model("User", userSchema);
export default User;