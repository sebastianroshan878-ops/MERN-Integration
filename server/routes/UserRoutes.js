const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/UserController');
const { protect } = require('../middleware/Auth');
const {
  validateRegister,
  validateLogin,
} = require('../middleware/validation');

// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', validateRegister, registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
router.post('/login', validateLogin, loginUser);

// @route   GET /api/users/profile
// @desc    Get user data/profile (Protected)
router.get('/profile', protect, getUserProfile);

// Also expose /me as an alias
router.get('/me', protect, getUserProfile);

module.exports = router;
