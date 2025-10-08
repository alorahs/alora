import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 5000
  },
  ourMission: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  ourVision: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  ourValues: { 
    type: [String], 
    required: true,
    maxlength: 500
  },
  teamMembers: [{
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 50
    },
    position: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 50
    },
    bio: { 
      type: String, 
      required: true,
      maxlength: 500
    },
    imageUrl: { 
      type: String,
      default: null
    },
    socialLinks: {
      linkedin: { 
        type: String,
        match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/, 'Invalid LinkedIn URL']
      },
      twitter: { 
        type: String,
        match: [/^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+$/, 'Invalid Twitter/X URL']
      }
    }
  }],
  contactEmail: { 
    type: String, 
    required: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
  },
  contactPhone: { 
    type: String, 
    required: true,
    match: [/^[0-9]{10,15}$/, 'Invalid phone number']
  },
  address: { 
    type: String, 
    required: true,
    maxlength: 300
  },
  socialLinks: {
    facebook: {
      type: String,
      match: [/^(https?:\/\/)?(www\.)?facebook\.com\/.+$/, 'Invalid Facebook URL']
    },
    twitter: {
      type: String,
      match: [/^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+$/, 'Invalid Twitter/X URL']
    },
    instagram: {
      type: String,
      match: [/^(https?:\/\/)?(www\.)?instagram\.com\/.+$/, 'Invalid Instagram URL']
    },
    linkedin: {
      type: String,
      match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/, 'Invalid LinkedIn URL']
    }
  },
  statistics: {
    happyClients: {
      type: Number,
      default: 0,
      min: 0
    },
    projectsCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    yearsExperience: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
aboutUsSchema.index({ title: 'text' });
aboutUsSchema.index({ createdAt: -1 });

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);
export default AboutUs;