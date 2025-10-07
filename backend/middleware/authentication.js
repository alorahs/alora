import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const verifyAccessToken = async (req, res, next) => {
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
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error('Error verifying access token:', error);
        return res.status(401).json({ errors: [{ msg: 'Invalid or expired access token' }] });
    }
};

export default verifyAccessToken;