const express = require('express');
const {
  registerUser,
  login,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Corrected casing
const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', registerUser);

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);  // Uses req.user
router.put('/profile', authMiddleware, updateUserProfile); // Uses req.user

module.exports = router;
