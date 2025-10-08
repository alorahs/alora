import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reviewee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  revieweeProfessional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String,
    maxlength: 500
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  attachments: [{
    type: String // URLs to images or files
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  },
  reported: {
    type: Boolean,
    default: false
  },
  response: {
    text: {
      type: String,
      maxlength: 500
    },
    respondedAt: {
      type: Date
    },
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ revieweeProfessional: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVerified: 1 });
reviewSchema.index({ createdAt: -1 });

// Virtual for reviewer name
reviewSchema.virtual('reviewerName').get(function() {
  return this.reviewer ? this.reviewer.username : 'Unknown User';
});

// Virtual for reviewee name
reviewSchema.virtual('revieweeName').get(function() {
  return this.reviewee ? this.reviewee.username : 'Unknown User';
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;