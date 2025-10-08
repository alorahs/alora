import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const resolveUserFromAccessToken = async (req) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        return { user: null, reason: 'missing' };
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.sub).select('-password');

        if (!user) {
            return { user: null, reason: 'user-not-found' };
        }

        return { user, reason: null };
    } catch (error) {
        return { user: null, reason: 'invalid', error };
    }
};

const verifyAccessToken = async (req, res, next) => {
    const { user, reason, error } = await resolveUserFromAccessToken(req);

    if (!user) {
        if (reason === 'invalid' && error) {
            console.error('Error verifying access token:', error);
        }

        const message = {
            missing: 'No access token provided',
            'user-not-found': 'User not found',
            invalid: 'Invalid or expired access token',
        }[reason] || 'Invalid or expired access token';

        return res.status(401).json({ errors: [{ msg: message }] });
    }

    req.user = user;
    next();
};

export default verifyAccessToken;