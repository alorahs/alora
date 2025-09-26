import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find({role: "professional"}).select("-password -phone -email -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;