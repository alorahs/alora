import express from "express";
import User from "../models/user.js";
import Review from "../models/review.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpires -verifyEmailToken -verifyEmailExpires -verifyPhoneToken -verifyPhoneExpires");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/", async (req, res) => {
  try {
    res.status(200).json({ message: "PUT request to the users route" , data: req.user, body: req.body});
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;