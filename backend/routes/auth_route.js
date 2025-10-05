import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import RefreshToken from '../models/refresh_token.js';
import { sendVerificationEmail } from '../utils/emailService.js';
import verifyAccessToken from '../middleware/authentication.js';

const router = express.Router();

// ===================
// Helper functions
// ===================
const generateAccessToken = (user) => {
  return jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h',
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  });
};

// ===================
// User Registration
// ===================
router.post(
  '/register',
  [
    body('fullName').isLength({ min: 3 }).withMessage('Full name must be at least 3 characters long'),
    body('username').isLength({ min: 8 }).withMessage('Username must be at least 8 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('phone').isMobilePhone().withMessage('Invalid phone number'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('role').isIn(['customer', 'professional']).withMessage('Role must be either customer, professional'),
  ],
  async (req, res) => {
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

      if (await User.findOne({ email })) {
        return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
      }
      if (await User.findOne({ username })) {
        return res.status(400).json({ errors: [{ msg: 'Username already taken' }] });
      }
      if (await User.findOne({ phone })) {
        return res.status(400).json({ errors: [{ msg: 'Phone number already in use' }] });
      }

      user = new User({
        username,
        email,
        password: await bcrypt.hash(password, 10),
        role: role || 'customer',
        phone,
        fullName,
      });

      await user.save();

      // Send verification email
      const verifyEmailToken = jwt.sign(
        { id: user._id },
        process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      user.verifyEmailToken = verifyEmailToken;
      user.verifyEmailExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      await sendVerificationEmail(user.email, user.verifyEmailToken, user.fullName);

      res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

// ===================
// User Login
// ===================
router.post(
  '/login',
  [
    body('identifier').exists().withMessage('Email, username, or phone number is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { identifier, password } = req.body;

    try {
      console.log('Login attempt with identifier:', identifier);

      // detect identifier type
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;

      let query = {};
      if (emailRegex.test(identifier)) {
        query = { email: identifier };
      } else if (phoneRegex.test(identifier.replace(/[\s\-\(\)]/g, ''))) {
        query = { phone: identifier };
      } else {
        query = { username: identifier };
      }

      const user = await User.findOne({
        $or: [query, { email: identifier }, { username: identifier }, { phone: identifier }],
      }).select('+password');

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Store refresh token in DB
      const newRefreshToken = new RefreshToken({
        token: refreshToken,
        user: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await newRefreshToken.save();

      // Set cookies (for web clients)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Also send tokens in JSON (for mobile clients)
      res.status(200).json({
        msg: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          phone: user.phone,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

// ===================
// Logout
// ===================
router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
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

// ===================
// Refresh Token
// ===================
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ errors: [{ msg: 'No refresh token provided' }] });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await RefreshToken.findOne({ token: refreshToken, user: decoded.id });

    if (!storedToken || new Date() > storedToken.expiresAt) {
      if (storedToken) await storedToken.deleteOne();
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      return res.status(401).json({ errors: [{ msg: 'Invalid or expired refresh token' }] });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ errors: [{ msg: 'User not found' }] });
    }

    const accessToken = generateAccessToken(user);

    // Update cookie for web clients
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return JSON for mobile clients
    res.status(200).json({
      msg: 'Access token refreshed',
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

// ===================
// Get Current User
// ===================
router.get('/me', verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
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
