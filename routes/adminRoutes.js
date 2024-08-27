// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/AdminController');

// Route to get all users
router.get('/get_all_users', adminControllers.getUsers);

// Route to get total numbers of tasks classified by their status
router.get('/get_all_tasks_by_status', adminControllers.getTotalTasksByStatus);

router.get('/get_all_tasks_by_types', adminControllers.getTaskSummaryByType);

router.post('/log-login', adminControllers.logLoginEvent);
router.get('/get_monthly_user_stats', adminControllers.getMonthlyUserStats);

module.exports = router;