import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || req.user.role !== 'admin') {
        // Also allow default master PIN/dev bypass if in development
        if (process.env.NODE_ENV === 'development') {
          return next();
        }
        return res.status(403).json({ success: false, message: 'Access denied: Admin authorization required' });
      }

      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
    }
  } else {
    // If no token header provided
    return res.status(401).json({ success: false, message: 'No authorization token provided' });
  }
};
