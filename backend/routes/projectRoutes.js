const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// GET all / POST new
router.route("/").get(protect, getProjects).post(protect, adminOnly, createProject);

// GET one / PUT / DELETE
router
  .route("/:id")
  .get(protect, getProjectById)
  .put(protect, adminOnly, updateProject)
  .delete(protect, adminOnly, deleteProject);

module.exports = router;
