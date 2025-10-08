import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'booking', 'review', 'payment', 'message', 'alert'],
    default: 'info',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date,
    default: null
  },
  archived: {
    type: Boolean,
    default: false,
    index: true
  },
  archivedAt: {
    type: Date,
    default: null
  },
  // Add navigation URL field
  url: {
    type: String,
    default: null
  },
  actionUrl: {
    type: String,
    default: null
  },
  actionText: {
    type: String,
    default: null
  },
  relatedEntity: {
    type: {
      type: String,
      enum: ['booking', 'review', 'service', 'user', 'professional', 'file']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedEntity.type'
    }
  },
  metadata: {
    type: Map,
    of: String
  },
  channels: [{
    type: String,
    enum: ['in-app', 'email', 'sms', 'push']
  }],
  sentChannels: [{
    type: String,
    enum: ['in-app', 'email', 'sms', 'push']
  }],
  // Additional fields for better notification management
  scheduledFor: {
    type: Date,
    default: null
  },
  sentAt: {
    type: Date,
    default: null
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'delivered'],
    default: 'pending'
  },
  failureReason: {
    type: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries (excluding those already created by field-level indexes)
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, archived: 1 });
notificationSchema.index({ channels: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ deliveryStatus: 1 });

// Virtual for time since creation
notificationSchema.virtual('timeSinceCreation').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
});

// Virtual for isRecent (within last 24 hours)
notificationSchema.virtual('isRecent').get(function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
});

// Virtual for isScheduled
notificationSchema.virtual('isScheduled').get(function() {
  return this.scheduledFor && this.scheduledFor > new Date();
});

// Virtual for canBeSent
notificationSchema.virtual('canBeSent').get(function() {
  return !this.isScheduled && this.deliveryStatus === 'pending';
});

export default mongoose.model('Notification', notificationSchema);