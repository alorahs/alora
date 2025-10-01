import express from "express";
import AboutUs from "../models/aboutUs.js";
import { isAdmin } from "../middleware/authorization.js";
import verifyAccessToken from "../middleware/authentication.js";

const router = express.Router();

// Get About Us information
router.get("/", async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      return res.status(404).json({ message: "About Us information not found" });
    }
    res.json(aboutUs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create About Us information (only admin)
router.post("/", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const aboutUs = new AboutUs(req.body);
    const savedAboutUs = await aboutUs.save();
    res.status(201).json(savedAboutUs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update About Us information (only admin)
router.put("/:id", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const aboutUs = await AboutUs.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!aboutUs) {
      return res.status(404).json({ message: "About Us information not found" });
    }
    res.json(aboutUs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Initialize About Us with default data (only admin)
router.post("/initialize", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const existing = await AboutUs.findOne();
    if (existing) {
      return res.status(400).json({ message: "About Us information already exists" });
    }
    
    const defaultAboutUs = new AboutUs({
      title: "About Our Company",
      description: "We are a company dedicated to providing excellent services.",
      ourMission: "Our mission is to deliver quality services to our customers.",
      ourVision: "Our vision is to become a leader in our industry.",
      ourValues: ["Integrity", "Quality", "Customer Satisfaction"],
      teamMembers: [],
      contactEmail: "info@company.com",
      contactPhone: "+1234567890",
      address: "123 Main Street, City, Country",
      socialLinks: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: ""
      }
    });
    
    const savedAboutUs = await defaultAboutUs.save();
    res.status(201).json(savedAboutUs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;