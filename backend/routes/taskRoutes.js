const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require("../controllers/taskController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Dashboard stats
router.get("/dashboard", protect, getDashboardStats);

// GET all / POST new
router.route("/").get(protect, getTasks).post(protect, adminOnly, createTask);

// PUT update / DELETE
router
  .route("/:id")
  .put(protect, updateTask)
  .delete(protect, adminOnly, deleteTask);

module.exports = router;
