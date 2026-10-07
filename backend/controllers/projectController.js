const Project = require("../models/Project");
const User = require("../models/User");

// @route  GET /api/projects
// @access Private
const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      // Admin sees all projects they created
      projects = await Project.find({ createdBy: req.user._id })
        .populate("createdBy", "name email")
        .populate("members", "name email role");
    } else {
      // Members see only projects they are part of
      projects = await Project.find({ members: req.user._id })
        .populate("createdBy", "name email")
        .populate("members", "name email role");
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/projects
// @access Private (Admin only)
const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: members || [],
    });

    const populated = await project.populate([
      { path: "createdBy", select: "name email" },
      { path: "members", select: "name email role" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/projects/:id
// @access Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/projects/:id
// @access Private (Admin only)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only the creator can update
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, members } = req.body;
    project.title = title || project.title;
    project.description = description ?? project.description;
    project.members = members ?? project.members;

    const updated = await project.save();
    await updated.populate([
      { path: "createdBy", select: "name email" },
      { path: "members", select: "name email role" },
    ]);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/projects/:id
// @access Private (Admin only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
