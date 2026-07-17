const express = require('express');
const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  getDashboardStats,
} = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Dashboard stats route - Accessible to all logged-in users
router.get('/dashboard/stats', protect, getDashboardStats);

// Base CRUD routes
router
  .route('/')
  .post(protect, authorize('Admin'), apiLimiter, createMember) // Admin only write
  .get(protect, getMembers); // All authenticated read

router
  .route('/:id')
  .get(protect, getMemberById) // All authenticated read
  .put(protect, authorize('Admin'), apiLimiter, updateMember) // Admin only update
  .delete(protect, authorize('Admin'), apiLimiter, deleteMember); // Admin only delete

module.exports = router;
