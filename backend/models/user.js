import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['custoamer', 'professional'], default: 'customer', required: true },
    phone: { type: String , required: true, unique: true },
    fullName: { type: String, required: true },
    profilePicture: { type: String },
    address: { type: { street: String, city: String, state: String, zip: String } },
    bio: { type: String },
    skills: [{ type: String }],
    socialLinks: { linkedin: String, twitter: String, facebook: String, instagram: String },
    isActive: { type: Boolean, default: true },
    category: { type: String, enum: ['plumbing', 'electrical', 'cleaning', 'carpentry', 'painting', 'other'] },
    ratings: [{ type: Number, min: 0, max: 5 }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    workGallery: [{ type: String }],
    hourlyRate: { type: Number, min: 0 },
    availability: [{ day: String, timeSlots: [String] }],
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verifyEmailToken: { type: String },
    verifyEmailExpires: { type: Date },
    verifyPhoneToken: { type: String },
    verifyPhoneExpires: { type: Date },
}, {timestamps: true});



const User = mongoose.model("User", userSchema);
export default User;