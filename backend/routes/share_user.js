import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find({role: "professional"}).select("-password -settings -phone -email -phoneVerified -emailVerified -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await User.findById(id).select("-password -phone -email -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/verify-email', [
  body('token').exists().withMessage('Verification token is required')
], async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.verifyEmailExpires < Date.now()) {
      return res.status(400).json({ errors: [{ msg: 'Invalid or expired verification token' }] });
    }

    user.emailVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailExpires = undefined;
    await user.save();

    res.status(200).json({ msg: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

export default router;