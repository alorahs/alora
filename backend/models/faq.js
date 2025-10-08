import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  question: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  answer: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 2000
  },
  keywords: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  },
  notHelpfulCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
faqSchema.index({ category: 1 });
faqSchema.index({ isActive: 1 });
faqSchema.index({ question: 'text', answer: 'text' });
faqSchema.index({ sortOrder: 1 });
faqSchema.index({ createdAt: -1 });

// Virtual for helpfulness ratio
faqSchema.virtual('helpfulnessRatio').get(function() {
  const total = this.helpfulCount + this.notHelpfulCount;
  return total > 0 ? Math.round((this.helpfulCount / total) * 100) : 0;
});

// Virtual for engagement
faqSchema.virtual('engagement').get(function() {
  return this.helpfulCount + this.notHelpfulCount;
});

const Faq = mongoose.model("Faq", faqSchema);
export default Faq;