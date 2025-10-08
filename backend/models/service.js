import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  subCategory: {
    type: String,
    trim: true
  },
  icon: { 
    type: String, 
    required: true 
  },
  color: { 
    type: String, 
    required: true, 
    default: 'blue' 
  },
  isActive: {
    type: Boolean,
    default: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    min: 15,
    max: 480
  },
  basePrice: {
    type: Number,
    min: 0,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
serviceSchema.index({ title: 'text', description: 'text' });
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ createdBy: 1 });

// Virtual for service URL
serviceSchema.virtual('url').get(function() {
  return `/services/${this._id}`;
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;