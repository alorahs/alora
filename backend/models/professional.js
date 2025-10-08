import mongoose from "mongoose";

const professionalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['plumbing', 'electrical', 'cleaning', 'carpentry', 'painting', 'other'],
    index: true
  },
  subCategories: [{
    type: String,
    trim: true,
    index: true
  }],
  bio: {
    type: String,
    maxlength: 1000
  },
  skills: [{
    type: String,
    trim: true,
    index: true
  }],
  workGallery: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  hourlyRate: {
    type: Number,
    min: 0,
    default: 0,
    index: true
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      index: true
    },
    timeSlots: [{
      start: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      },
      end: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      }
    }]
  }],
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuingOrganization: {
      type: String,
      trim: true
    },
    issueDate: {
      type: Date
    },
    expirationDate: {
      type: Date
    },
    certificateUrl: {
      type: String
    }
  }],
  experience: {
    years: {
      type: Number,
      min: 0,
      default: 0
    },
    description: {
      type: String,
      maxlength: 500
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  verificationRequestedAt: {
    type: Date,
    default: null
  },
  verificationRequestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ratings: [{
    type: Number,
    min: 0,
    max: 5
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    index: true
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  servicesOffered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  portfolioItems: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    images: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }],
    completionDate: {
      type: Date
    }
  }],
  // Additional fields for better professional management
  responseTime: {
    type: Number, // in hours
    default: 24
  },
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    default: 'moderate'
  },
  languages: [{
    type: String,
    enum: ['en', 'es', 'fr', 'de', 'hi'],
    default: ['en']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (excluding those already created by field-level indexes)
professionalSchema.index({ averageRating: -1 });
professionalSchema.index({ createdAt: -1 });

// Virtual for full name from user
professionalSchema.virtual('fullName').get(function() {
  return this.user ? this.user.fullName : 'Unknown Professional';
});

// Virtual for display name from user
professionalSchema.virtual('displayName').get(function() {
  return this.user ? this.user.displayName : 'Unknown Professional';
});

// Virtual for email from user
professionalSchema.virtual('email').get(function() {
  return this.user ? this.user.email : 'Unknown';
});

// Virtual for phone from user
professionalSchema.virtual('phone').get(function() {
  return this.user ? this.user.phone : 'Unknown';
});

// Virtual for profile picture from user
professionalSchema.virtual('profilePicture').get(function() {
  return this.user ? this.user.profilePicture : null;
});

// Virtual for review statistics
professionalSchema.virtual('reviewStats').get(function() {
  return {
    averageRating: this.averageRating,
    totalReviews: this.totalReviews
  };
});

// Virtual for rating level
professionalSchema.virtual('ratingLevel').get(function() {
  if (this.averageRating >= 4.5) return 'Excellent';
  if (this.averageRating >= 4.0) return 'Very Good';
  if (this.averageRating >= 3.5) return 'Good';
  if (this.averageRating >= 3.0) return 'Average';
  return 'Below Average';
});

// Pre-save middleware to calculate average rating
professionalSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
    this.totalReviews = this.ratings.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
  next();
});

const Professional = mongoose.model("Professional", professionalSchema);
export default Professional;