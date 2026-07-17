const User = require('../models/User');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_9911', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please enter all required fields: name, email, password.');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('A user with that email already exists.');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'User',
    });

    if (user) {
      // Log Signup Activity
      await Activity.create({
        user: user._id,
        action: 'SIGNUP',
        details: `Registered account for ${user.name} (${user.role})`,
      });

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided.');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter both email and password.');
    }

    // Get user and explicitly select password since it has select: false
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Log Login Activity
      await Activity.create({
        user: user._id,
        action: 'LOGIN',
        details: `${user.name} logged in`,
      });

      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password.');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(404);
      throw new Error('User account not found.');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };
