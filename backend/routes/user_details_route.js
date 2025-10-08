import express from "express";
import UserDetails from "../models/user_details.js";
import User from "../models/user.js";
import { body, validationResult } from "express-validator";
import verifyAccessToken from "../middleware/authentication.js";

const router = express.Router();

// Get user details for the authenticated user
router.get("/", verifyAccessToken, async (req, res) => {
  try {
    const userDetails = await UserDetails.findOne({ user: req.user._id })
      .populate('user', 'fullName email phone profilePicture');
    
    if (!userDetails) {
      return res.status(404).json({ message: "User details not found" });
    }
    
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create user details (for new users)
router.post("/", verifyAccessToken, async (req, res) => {
  try {
    // Check if user details already exist
    const existingDetails = await UserDetails.findOne({ user: req.user._id });
    if (existingDetails) {
      return res.status(400).json({ message: "User details already exist" });
    }
    
    const userDetails = new UserDetails({
      user: req.user._id,
      ...req.body
    });
    
    await userDetails.save();
    
    // Update user with user details reference
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { userDetails: userDetails._id },
      { new: true }
    );
    
    res.status(201).json({ message: "User details created successfully", userDetails });
  } catch (error) {
    console.error('Error creating user details:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user details
router.put("/", verifyAccessToken, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updates.user;
    
    const userDetails = await UserDetails.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!userDetails) {
      return res.status(404).json({ message: "User details not found" });
    }
    
    res.status(200).json({ message: "User details updated successfully", userDetails });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add payment method
router.post("/payment-methods", verifyAccessToken, async (req, res) => {
  try {
    const userDetails = await UserDetails.findOne({ user: req.user._id });
    if (!userDetails) {
      return res.status(404).json({ message: "User details not found" });
    }
    
    // If this is the first payment method, make it default
    if (!req.body.isDefault && (!userDetails.paymentMethods || userDetails.paymentMethods.length === 0)) {
      req.body.isDefault = true;
    }
    
    userDetails.paymentMethods.push(req.body);
    await userDetails.save();
    
    res.status(201).json({ message: "Payment method added successfully", paymentMethods: userDetails.paymentMethods });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update payment method
router.put("/payment-methods/:methodId", verifyAccessToken, async (req, res) => {
  try {
    const userDetails = await UserDetails.findOne({ user: req.user._id });
    if (!userDetails) {
      return res.status(404).json({ message: "User details not found" });
    }
    
    const methodIndex = userDetails.paymentMethods.findIndex(method => method._id.toString() === req.params.methodId);
    if (methodIndex === -1) {
      return res.status(404).json({ message: "Payment method not found" });
    }
    
    // If setting as default, unset other defaults
    if (req.body.isDefault) {
      userDetails.paymentMethods.forEach(method => {
        if (method._id.toString() === req.params.methodId) {
          method.isDefault = true;
        } else {
          method.isDefault = false;
        }
      });
    }
    
    userDetails.paymentMethods[methodIndex] = { ...userDetails.paymentMethods[methodIndex], ...req.body };
    await userDetails.save();
    
    res.status(200).json({ message: "Payment method updated successfully", paymentMethods: userDetails.paymentMethods });
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete payment method
router.delete("/payment-methods/:methodId", verifyAccessToken, async (req, res) => {
  try {
    const userDetails = await UserDetails.findOne({ user: req.user._id });
    if (!userDetails) {
      return res.status(404).json({ message: "User details not found" });
    }
    
    const methodIndex = userDetails.paymentMethods.findIndex(method => method._id.toString() === req.params.methodId);
    if (methodIndex === -1) {
      return res.status(404).json({ message: "Payment method not found" });
    }
    
    // Prevent deletion of the default payment method if it's the only one
    if (userDetails.paymentMethods[methodIndex].isDefault && userDetails.paymentMethods.length === 1) {
      return res.status(400).json({ message: "Cannot delete the default payment method when it's the only one" });
    }
    
    userDetails.paymentMethods.splice(methodIndex, 1);
    
    // If we deleted the default payment method, set another one as default
    if (userDetails.paymentMethods.length > 0 && !userDetails.paymentMethods.some(method => method.isDefault)) {
      userDetails.paymentMethods[0].isDefault = true;
    }
    
    await userDetails.save();
    
    res.status(200).json({ message: "Payment method deleted successfully", paymentMethods: userDetails.paymentMethods });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user analytics
router.get("/analytics", verifyAccessToken, async (req, res) => {
  try {
    const userDetails = await UserDetails.findOne({ user: req.user._id }, 'analytics');
    
    if (!userDetails) {
      return res.status(404).json({ message: "User details not found" });
    }
    
    res.status(200).json({ analytics: userDetails.analytics });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user preferences
router.put("/preferences", verifyAccessToken, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    const userDetails = await UserDetails.findOneAndUpdate(
      { user: req.user._id },
      { $set: { preferences } },
      { new: true, runValidators: true }
    );
    
    if (!userDetails) {
      return res.status(404).json({ message: "User details not found" });
    }
    
    res.status(200).json({ message: "Preferences updated successfully", preferences: userDetails.preferences });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;