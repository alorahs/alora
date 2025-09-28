import express from "express";
import User from "../models/user.js";
import Review from "../models/review.js";
import { body, validationResult } from "express-validator";
import { isAdmin } from "../middleware/authorization.js";
import verifyAccessToken from "../middleware/authentication.js";

const router = express.Router();

// Get all users (admin only)
router.get("/", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires");
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific user by ID (authenticated users)
router.get("/:id", verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile (user can update their own profile)
router.put("/", verifyAccessToken, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authentication middleware sets req.user
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updates.password;
    delete updates.role;
    delete updates.email;
    delete updates.resetPasswordToken;
    delete updates.resetPasswordExpires;
    delete updates.verifyEmailToken;
    delete updates.verifyEmailExpires;
    delete updates.verifyPhoneToken;
    delete updates.verifyPhoneExpires;

    console.log('Updates:', updates);
    
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user by ID (admin only)
router.put("/:id", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updates.password;
    delete updates.resetPasswordToken;
    delete updates.resetPasswordExpires;
    delete updates.verifyEmailToken;
    delete updates.verifyEmailExpires;
    delete updates.verifyPhoneToken;
    delete updates.verifyPhoneExpires;
    
    // Only admins can update user roles
    if (req.user.role !== 'admin') {
      delete updates.role;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete user (admin only)
router.delete("/:id", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Also delete associated reviews
    await Review.deleteMany({ $or: [{ reviewer: req.params.id }, { reviewee: req.params.id }] });
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user reviews (authenticated users)
router.get("/:id/reviews", verifyAccessToken, async (req, res) => {
  try {
    const reviews = await Review.find({ 
      $or: [{ reviewer: req.params.id }, { reviewee: req.params.id }] 
    }).populate('reviewer reviewee', 'fullName username');
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;