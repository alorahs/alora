import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  token: { 
    type: String, 
    required: true, 
    unique: true,
    maxlength: 500
  },
  deviceInfo: { 
    type: {
      userAgent: String,
      platform: String,
      browser: String,
      ip: String
    }
  },
  ipAddress: {
    type: String,
    match: [/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid IP address']
  },
  expiresAt: { 
    type: Date, 
    required: true 
  },
  revoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date,
    default: null
  },
  revokedReason: {
    type: String,
    maxlength: 200
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ user: 1 });
refreshTokenSchema.index({ revoked: 1 });
refreshTokenSchema.index({ createdAt: -1 });

// Virtual for isExpired
refreshTokenSchema.virtual('isExpired').get(function() {
  return Date.now() > this.expiresAt;
});

// Virtual for isValid
refreshTokenSchema.virtual('isValid').get(function() {
  return !this.revoked && !this.isExpired;
});

// Ensure token expires
refreshTokenSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Set default expiration to 7 days
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.model('RefreshToken', refreshTokenSchema);