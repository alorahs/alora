import mongoose from "mongoose";

const reachUsSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: false,
      default: null
    },
    fullName: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 3,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
    },
    phone: {
      type: String,
      match: [/^[0-9]{10,15}$/, 'Invalid phone number']
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
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
      enum: ['general', 'support', 'billing', 'partnership', 'other'],
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
reachUsSchema.index({ email: 1 });
reachUsSchema.index({ category: 1 });
reachUsSchema.index({ status: 1 });
reachUsSchema.index({ priority: 1 });
reachUsSchema.index({ createdAt: -1 });

// Virtual for user display
reachUsSchema.virtual('userDisplay').get(function() {
  return this.user ? this.user.username : this.fullName;
});

const ReachUs = mongoose.model("ReachUs", reachUsSchema);
export default ReachUs;