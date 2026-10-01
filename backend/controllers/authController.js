import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'penguin_default_secret', {
    expiresIn: '30d',
  });
};

/**
 * @desc Admin Login (Supports email/password or instant Master Passcode '8842' / 'admin123')
 * @route POST /api/auth/admin/login
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password, pin } = req.body;

    // Master PIN quick authentication support for store owners
    if (pin === '8842' || pin === 'admin123' || password === 'admin123') {
      const token = jwt.sign({ id: 'admin_master_id', role: 'admin' }, process.env.JWT_SECRET || 'penguin_default_secret', {
        expiresIn: '30d',
      });

      return res.status(200).json({
        success: true,
        message: 'Master Admin Access Granted',
        token,
        user: {
          name: 'Penguin Atelier Owner',
          email: email || 'admin@penguin.com',
          role: 'admin',
        },
      });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Auto-create default admin if first time
      if (email === process.env.ADMIN_EMAIL || email === 'admin@penguin.com') {
        user = await User.create({
          name: 'Atelier Administrator',
          email: email,
          password: password,
          role: 'admin',
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
