import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ourMission: { type: String, required: true },
  ourVision: { type: String, required: true },
  ourValues: { type: [String], required: true },
  teamMembers: [{
    name: { type: String, required: true },
    position: { type: String, required: true },
    bio: { type: String, required: true },
    imageUrl: { type: String }
  }],
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  address: { type: String, required: true },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  }
}, { timestamps: true });

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);
export default AboutUs;