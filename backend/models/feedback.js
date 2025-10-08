import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: false,
      default: null
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 3,
      trim: true
    },
    email: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 5,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value"
      }
    },
    subject: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 3,
      trim: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000,
      minlength: 10,
      trim: true
    },
    category: {
      type: String,
      enum: ['general', 'bug', 'feature', 'support', 'billing', 'other'],
      default: 'general'
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    attachments: [{
      type: String // URLs to files
    }],
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    },
    responded: {
      type: Boolean,
      default: false
    },
    response: {
      text: {
        type: String,
        maxlength: 2000
      },
      respondedAt: {
        type: Date
      },
      responder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
feedbackSchema.index({ email: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ priority: 1 });
feedbackSchema.index({ createdAt: -1 });

// Virtual for rating display
feedbackSchema.virtual('ratingDisplay').get(function() {
  return `${this.rating}/5 stars`;
});

// Virtual for user display
feedbackSchema.virtual('userDisplay').get(function() {
  return this.user ? this.user.username : this.name;
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;