import User from '../models/user.js';

// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
  }
  
  next();
};

// Middleware to check if user is professional or admin
export const isProfessionalOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'professional') {
    return res.status(403).json({ message: 'Access forbidden: Professionals and admins only' });
  }
  
  next();
};

// Middleware to check if user is customer or admin
export const isCustomerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Access forbidden: Customers and admins only' });
  }
  
  next();
};

export default {
  isAuthenticated,
  isAdmin,
  isProfessionalOrAdmin,
  isCustomerOrAdmin
};