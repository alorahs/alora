import express from "express";
import User from "../models/user.js";
import UserDetails from "../models/user_details.js";
import Professional from "../models/professional.js";
import Review from "../models/review.js";
import { body, validationResult } from "express-validator";
import { isAdmin } from "../middleware/authorization.js";
import verifyAccessToken from "../middleware/authentication.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get all users (admin only)
router.get("/", verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires -twoFactorSecret");
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user settings
router.get("/settings", verifyAccessToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('settings');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return default settings if none exist
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      bookingReminders: true,
      reviewNotifications: true,
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowDirectMessages: true,
      theme: 'system',
      language: 'en',
      timezone: 'Asia/Kolkata',
      twoFactorEnabled: false,
      sessionTimeout: 30,
    };
    
    res.status(200).json({ 
      settings: user.settings ? { ...defaultSettings, ...user.settings } : defaultSettings 
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific user by ID (authenticated users)
router.get("/:id", verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('userDetails')
      .populate('professionalProfile')
      .select("-password -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires -twoFactorSecret");
    
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
    console.log('updates:', updates);
    
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
    delete updates.twoFactorSecret;
    delete updates.authMethod;

    console.log('Updates:', updates);
    
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires -twoFactorSecret");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/role", verifyAccessToken, async (req, res) => { 
  try { 
    const userId = req.user._id;
    const updates = req.body;
    
    // Validate role value
    if (updates.role && !['customer', 'professional'].includes(updates.role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }
    
    // First update the user role
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) { 
      return res.status(404).json({ message: "User not found" }); 
    }
    
    // Then handle professional profile based on the new role
    if (updates.role === 'professional') {
      // Create or update professional profile when switching to professional role
      let professionalProfile = await Professional.findOne({ user: userId });
      
      if (!professionalProfile) {
        // Create a new professional profile
        professionalProfile = new Professional({
          user: userId,
          category: 'other', // Default category
          bio: updatedUser.bio || '',
          skills: [],
          hourlyRate: 0,
          availability: []
        });
        await professionalProfile.save();
        
        // Link the professional profile to the user
        updatedUser.professionalProfile = professionalProfile._id;
        await updatedUser.save();
      }
    } else if (updates.role === 'customer') {
      // Delete professional profile when switching to customer role
      const professionalProfile = await Professional.findOne({ user: userId });
      if (professionalProfile) {
        await Professional.deleteOne({ user: userId });
        // Remove the professional profile reference from user
        updatedUser.professionalProfile = null;
        await updatedUser.save();
      }
    }
    
    res.status(200).json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) { 
    console.error('Error updating user role:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user settings
router.put("/settings", verifyAccessToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { settings } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { settings } },
      { new: true, runValidators: true }
    ).select('settings');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      message: "Settings updated successfully", 
      settings: user.settings 
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
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
    delete updates.twoFactorSecret;
    
    // Only admins can update user roles
    if (req.user.role !== 'admin') {
      delete updates.role;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires -twoFactorSecret");
    
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
    
    // Also delete associated user details and professional profile
    await UserDetails.findOneAndDelete({ user: req.params.id });
    await Professional.findOneAndDelete({ user: req.params.id });
    
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

// Change password
router.put("/change-password", verifyAccessToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });
    
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Enable/disable two-factor authentication
router.put("/toggle-2fa", verifyAccessToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { enabled } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: enabled },
      { new: true }
    ).select('twoFactorEnabled');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`, 
      twoFactorEnabled: user.twoFactorEnabled 
    });
  } catch (error) {
    console.error('Error toggling 2FA:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Save push notification token
router.post("/push-token", verifyAccessToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { token } = req.body;
    
    // Validate token
    if (!token) {
      return res.status(400).json({ message: "Push token is required" });
    }
    
    // Add push token to user's settings or create a new field for it
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { pushTokens: token } // Use $addToSet to avoid duplicates
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "Push token saved successfully" });
  } catch (error) {
    console.error('Error saving push token:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete account (soft delete or mark for deletion)
router.delete("/delete-account", verifyAccessToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Instead of immediately deleting, mark account for deletion
    // This allows for a grace period where users can recover their account
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isActive: false,
        deletionRequestedAt: new Date(),
        // You might want to anonymize some data here
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      message: "Account deletion requested. Your account will be deleted in 30 days. Contact support to cancel this request." 
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;