import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import RefreshToken from '../models/refresh_token.js';
import { sendVerificationEmail } from '../utils/emailService.js';

const router = express.Router();

// Helper functions
const generateAccessToken = (user) => {
  return jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

// User Registration
router.post('/register', [
  body('fullName').isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
  body('username').isLength({ min: 8 }).withMessage('Username must be at least 8 characters long'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('role').isIn(['customer', 'professional']).withMessage('Role must be either customer, professional'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role, phone, fullName } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email, username, phone });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Username already taken' }] });
    }

    user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Phone number already in use' }] });
    }

    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || 'customer',
      phone,
      fullName
    });

    await user.save();
    // Send verification email
    const verifyEmailToken = jwt.sign({ id: user._id }, process.env.EMAIL_VERIFICATION_TOKEN_SECRET, { expiresIn: '15m' });
    user.verifyEmailToken = verifyEmailToken;
    user.verifyEmailExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    await sendVerificationEmail(user.email, user.verifyEmailToken, user.fullName);
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

// User Login
router.post('/login', [
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Invalid email address'),
  body('username').optional({ nullable: true, checkFalsy: true }).isLength({ min: 8 }).withMessage('Username must be at least 8 characters long'),
  body('phone').optional({ nullable: true, checkFalsy: true }).isMobilePhone().withMessage('Invalid phone number'),
  body('password').exists().withMessage('Password is required'),
  body().custom(body => {
    if (!body.email && !body.username && !body.phone) {
      throw new Error('Either email, username or phone number is required');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, username, phone, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { username }, { phone }] }).select('+password');
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    if (!user.emailVerified) {
      const verifyEmailToken = jwt.sign({ id: user._id }, process.env.EMAIL_VERIFICATION_TOKEN_SECRET, { expiresIn: '15m' });
      user.verifyEmailToken = verifyEmailToken;
      user.verifyEmailExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
      await sendVerificationEmail(user.email, user.verifyEmailToken, user.fullName);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    const newRefreshToken = new RefreshToken({ token: refreshToken, user: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }); // 7 days
    await newRefreshToken.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ msg: 'Login successful', user: { id: user._id, username: user.username, email: user.email, role: user.role, fullName: user.fullName, phone: user.phone } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ errors: [{ msg: 'No refresh token provided' }] });
  }
  try {
    await RefreshToken.findOneAndDelete({ token: refreshToken });
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.status(200).json({ msg: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ errors: [{ msg: 'No refresh token provided' }] });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await RefreshToken.findOne({ token: refreshToken, user: decoded.id });

    if (!storedToken || new Date() > storedToken.expiresAt) {
      if (storedToken) {
        await storedToken.deleteOne();
      }
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      return res.status(401).json({ errors: [{ msg: 'Invalid or expired refresh token' }] });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ errors: [{ msg: 'User not found' }] });
    }

    const accessToken = generateAccessToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ msg: 'Access token refreshed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

router.get('/me', async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ errors: [{ msg: 'No access token provided' }] });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select('-password');
    if (!user) {
      return res.status(401).json({ errors: [{ msg: 'User not found' }] });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

export default router;