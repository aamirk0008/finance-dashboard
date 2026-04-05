const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// All routes require login
router.use(protect);

// Summary — all roles can access
router.get('/summary', requireRole('admin', 'analyst', 'viewer'), dashboardController.getSummary);

// Category breakdown — analyst and admin only
router.get('/categories', requireRole('admin', 'analyst'), dashboardController.getCategoryBreakdown);

// Monthly trends — analyst and admin only
router.get('/trends', requireRole('admin', 'analyst'), dashboardController.getMonthlyTrends);

module.exports = router;