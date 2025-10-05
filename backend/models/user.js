import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'professional', 'admin'], default: 'customer', required: true },
  phone: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  profilePicture: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    lon: Number,
    lat: Number
  },
  bio: { type: String },
  skills: [{ type: String }],
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String }
  },
  isActive: { type: Boolean, default: true },
  category: { type: String, enum: ['','plumbing', 'electrical', 'cleaning', 'carpentry', 'painting', 'other'] },
  ratings: [{ type: Number, min: 0, max: 5 }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  workGallery: [{ type: String }],
  hourlyRate: { type: Number, min: 0 },
  availability: [{
    day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
    timeSlots: [{ start: String, end: String }]
  }],
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  verifyEmailToken: { type: String },
  verifyEmailExpires: { type: Date },
  verifyPhoneToken: { type: String },
  verifyPhoneExpires: { type: Date },
  deletionRequestedAt: { type: Date },
  isVerifiedProfessional: { type: Boolean, default: false },
  settings: {
    // Notification preferences
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false },
    bookingReminders: { type: Boolean, default: true },
    reviewNotifications: { type: Boolean, default: true },
    
    // Privacy settings
    profileVisibility: { type: String, enum: ['public', 'private', 'professional-only'], default: 'public' },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    allowDirectMessages: { type: Boolean, default: true },
    
    // App preferences
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    
    // Security settings
    twoFactorEnabled: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 } // in minutes
  }
}, { timestamps: true });

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ category: 1 });
userSchema.index({ isActive: 1 });

const User = mongoose.model("User", userSchema);
export default User;
