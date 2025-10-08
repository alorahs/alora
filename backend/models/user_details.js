import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    phone: {
      type: String,
      match: [/^[0-9]{10,15}$/, 'Invalid phone number']
    },
    relationship: {
      type: String,
      trim: true,
      maxlength: 50
    }
  },
  identification: {
    type: {
      type: String,
      enum: ['passport', 'driver-license', 'national-id', 'other']
    },
    number: {
      type: String,
      trim: true
    },
    issuingCountry: {
      type: String,
      trim: true
    },
    issuingAuthority: {
      type: String,
      trim: true
    },
    issueDate: {
      type: Date
    },
    expirationDate: {
      type: Date
    },
    documentFront: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    },
    documentBack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }
  },
  paymentMethods: [{
    type: {
      type: String,
      enum: ['credit-card', 'debit-card', 'paypal', 'bank-account', 'upi'],
      required: true
    },
    provider: {
      type: String,
      trim: true
    },
    lastFourDigits: {
      type: String,
      match: [/^[0-9]{4}$/, 'Invalid last four digits']
    },
    expiryMonth: {
      type: Number,
      min: 1,
      max: 12
    },
    expiryYear: {
      type: Number,
      min: new Date().getFullYear()
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    billingAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zip: { type: String, match: [/^[0-9]{5,10}$/, 'Invalid zip code'] },
      country: { type: String, default: 'India' }
    }
  }],
  preferences: {
    communication: {
      preferredMethod: {
        type: String,
        enum: ['email', 'sms', 'push', 'whatsapp'],
        default: 'email'
      },
      preferredLanguage: {
        type: String,
        default: 'en',
        enum: ['en', 'es', 'fr', 'de', 'hi']
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'professional-only'],
        default: 'public'
      },
      showEmail: {
        type: Boolean,
        default: false
      },
      showPhone: {
        type: Boolean,
        default: false
      }
    }
  },
  activity: {
    lastActive: {
      type: Date,
      default: Date.now
    },
    devices: [{
      deviceId: {
        type: String,
        required: true
      },
      deviceType: {
        type: String,
        enum: ['mobile', 'tablet', 'desktop', 'other']
      },
      deviceName: {
      type: String
      },
      lastLogin: {
        type: Date,
        default: Date.now
      },
      ipAddresses: [{
        type: String,
        match: [/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid IP address']
      }]
    }]
  },
  analytics: {
    totalLogins: {
      type: Number,
      default: 0,
      min: 0
    },
    totalBookings: {
      type: Number,
      default: 0,
      min: 0
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  // Additional fields for better user management
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (excluding those already created by unique constraints)
userDetailsSchema.index({ 'paymentMethods.isDefault': 1 });
userDetailsSchema.index({ 'activity.lastActive': -1 });
userDetailsSchema.index({ createdAt: -1 });
userDetailsSchema.index({ referredBy: 1 });
userDetailsSchema.index({ loyaltyPoints: -1 });

// Virtual for user's full name
userDetailsSchema.virtual('fullName').get(function() {
  return this.user ? this.user.fullName : 'Unknown User';
});

// Virtual for user's email
userDetailsSchema.virtual('email').get(function() {
  return this.user ? this.user.email : 'Unknown';
});

// Virtual for user's phone
userDetailsSchema.virtual('phone').get(function() {
  return this.user ? this.user.phone : 'Unknown';
});

// Virtual for age
userDetailsSchema.virtual('age').get(function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
});

// Virtual for isBirthdayToday
userDetailsSchema.virtual('isBirthdayToday').get(function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    return today.getMonth() === birthDate.getMonth() && 
           today.getDate() === birthDate.getDate();
  }
  return false;
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
export default UserDetails;