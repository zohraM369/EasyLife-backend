// controllers/AdminController.js
const adminService = require("../services/adminService");

const getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTotalTasksByStatus = async (req, res) => {
  try {
    const result = await adminService.getTotalTasksByStatus();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching task totals by status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTaskSummaryByType = async (req, res) => {
  try {
    const summary = await adminService.getTaskSummaryByType();
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching task summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logLoginEvent = async (req, res) => {
  try {
    const { userId } = req.body;
    await adminService.logLoginEvent(userId);
    res.status(200).json({ message: "Login event logged successfully" });
  } catch (error) {
    console.error("Error logging login event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMonthlyUserStats = async (req, res) => {
  try {
    const stats = await adminService.getMonthlyUserStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching monthly user stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUsers,
  getTotalTasksByStatus,
  getTaskSummaryByType,
  logLoginEvent,
  getMonthlyUserStats,
};
