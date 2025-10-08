import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
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
  notes: {
    type: String,
    maxlength: 200,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure a user can only favorite a professional once
favoriteSchema.index({ user: 1, professional: 1 }, { unique: true });
favoriteSchema.index({ professional: 1 });
favoriteSchema.index({ professionalProfile: 1 });
favoriteSchema.index({ createdAt: -1 });

// Virtual for favorite reference
favoriteSchema.virtual('reference').get(function() {
  return `${this.user.username} -> ${this.professional.username}`;
});

export default mongoose.model('Favorite', favoriteSchema);