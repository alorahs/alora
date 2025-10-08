import express from "express";
import Professional from "../models/professional.js";
import User from "../models/user.js";
import File from "../models/file.js";
import { body, validationResult } from "express-validator";
import { isAdmin } from "../middleware/authorization.js";
import verifyAccessToken from "../middleware/authentication.js";

const router = express.Router();

// Get all professionals
router.get("/", async (req, res) => {
  try {
    const professionals = await Professional.find({ isVerified: true })
      .populate('user', 'fullName username profilePicture')
      .populate('workGallery')
      .populate('servicesOffered')
      .populate({
        path: 'portfolioItems.images',
        select: '_id filename originalName mimetype size url category isPublic createdAt updatedAt'
      })
      .sort({ averageRating: -1 });
    
    res.status(200).json(professionals);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific professional by ID
router.get("/:id", async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id)
      .populate('user', 'fullName username profilePicture email phone')
      .populate('workGallery')
      .populate('servicesOffered')
      .populate('certifications.document')
      .populate({
        path: 'portfolioItems.images',
        select: '_id filename originalName mimetype size url category isPublic createdAt updatedAt'
      });
    
    if (!professional) {
      return res.status(404).json({ message: "Professional not found" });
    }
    
    res.status(200).json(professional);
  } catch (error) {
    console.error('Error fetching professional:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get professionals by category
router.get("/category/:category", async (req, res) => {
  try {
    const professionals = await Professional.find({ 
      category: req.params.category,
      isVerified: true
    })
      .populate('user', 'fullName username profilePicture')
      .populate('workGallery')
      .populate({
        path: 'portfolioItems.images',
        select: '_id filename originalName mimetype size url category isPublic createdAt updatedAt'
      })
      .sort({ averageRating: -1 });
    
    res.status(200).json(professionals);
  } catch (error) {
    console.error('Error fetching professionals by category:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create professional profile (for users with professional role)
router.post("/", verifyAccessToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if user has professional role
    const user = await User.findById(userId);
    if (!user || user.role !== 'professional') {
      return res.status(403).json({ message: "Only users with professional role can create a professional profile" });
    }
    
    // Check if professional profile already exists
    const existingProfile = await Professional.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Professional profile already exists" });
    }
    
    const professional = new Professional({
      user: userId,
      ...req.body
    });
    
    await professional.save();
    
    // Update user with professional profile reference
    user.professionalProfile = professional._id;
    await user.save();
    
    res.status(201).json({ message: "Professional profile created successfully", professional });
  } catch (error) {
    console.error('Error creating professional profile:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update professional profile
router.put("/:id", verifyAccessToken, async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({ message: "Professional profile not found" });
    }
    
    // Check if user is owner or admin
    if (req.user._id.toString() !== professional.user.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const updates = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updates.user;
    delete updates.isVerified;
    delete updates.averageRating;
    delete updates.totalReviews;
    delete updates.ratings;
    
    const updatedProfessional = await Professional.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ message: "Professional profile updated successfully", professional: updatedProfessional });
  } catch (error) {
    console.error('Error updating professional profile:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Request profile verification
router.post("/:id/request-verification", verifyAccessToken, async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({ message: "Professional profile not found" });
    }
    
    // Check if user is owner
    if (req.user._id.toString() !== professional.user.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // Update verification request fields
    professional.verificationRequestedAt = new Date();
    professional.verificationRequestedBy = req.user._id;
    
    await professional.save();
    
    res.status(200).json({ message: "Verification request submitted successfully" });
  } catch (error) {
    console.error('Error requesting verification:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Verify professional profile
router.put("/:id/verify", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({ message: "Professional profile not found" });
    }
    
    professional.isVerified = true;
    
    await professional.save();
    
    res.status(200).json({ message: "Professional profile verified successfully", professional });
  } catch (error) {
    console.error('Error verifying professional profile:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get professional portfolio
router.get("/:id/portfolio", async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id)
      .populate({
        path: 'portfolioItems.images',
        select: '_id filename originalName mimetype size url category isPublic createdAt updatedAt'
      });
    
    if (!professional) {
      return res.status(404).json({ message: "Professional not found" });
    }
    
    res.status(200).json(professional.portfolioItems);
  } catch (error) {
    console.error('Error fetching professional portfolio:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add portfolio item
router.post("/:id/portfolio", verifyAccessToken, async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({ message: "Professional profile not found" });
    }
    
    // Check if user is owner
    if (req.user._id.toString() !== professional.user.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    professional.portfolioItems.push(req.body);
    await professional.save();
    
    res.status(201).json({ message: "Portfolio item added successfully", portfolioItems: professional.portfolioItems });
  } catch (error) {
    console.error('Error adding portfolio item:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update portfolio item
router.put("/:id/portfolio/:itemId", verifyAccessToken, async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({ message: "Professional profile not found" });
    }
    
    // Check if user is owner
    if (req.user._id.toString() !== professional.user.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const itemIndex = professional.portfolioItems.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }
    
    professional.portfolioItems[itemIndex] = { ...professional.portfolioItems[itemIndex], ...req.body };
    await professional.save();
    
    res.status(200).json({ message: "Portfolio item updated successfully", portfolioItems: professional.portfolioItems });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete portfolio item
router.delete("/:id/portfolio/:itemId", verifyAccessToken, async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({ message: "Professional profile not found" });
    }
    
    // Check if user is owner
    if (req.user._id.toString() !== professional.user.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    professional.portfolioItems = professional.portfolioItems.filter(item => item._id.toString() !== req.params.itemId);
    await professional.save();
    
    res.status(200).json({ message: "Portfolio item deleted successfully", portfolioItems: professional.portfolioItems });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;