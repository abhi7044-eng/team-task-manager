const Task = require("../models/Task");
const Project = require("../models/Project");

// @route  GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      const adminProjects = await Project.find({ createdBy: req.user._id }).select("_id");
      const projectIds = adminProjects.map((p) => p._id);
      tasks = await Task.find({ projectId: { $in: projectIds } })
        .populate("assignedTo", "name email")
        .populate("projectId", "title");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate("assignedTo", "name email")
        .populate("projectId", "title");
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/tasks
// @access Private (Admin only)
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate, priority } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      dueDate,
      priority: priority || "Medium",
    });

    const populated = await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "projectId", select: "title" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "admin") {
      const { title, description, assignedTo, dueDate, status, priority } = req.body;
      task.title = title || task.title;
      task.description = description ?? task.description;
      task.assignedTo = assignedTo || task.assignedTo;
      task.dueDate = dueDate || task.dueDate;
      task.status = status || task.status;
      task.priority = priority || task.priority;
    } else {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }
      task.status = req.body.status || task.status;
    }

    const updated = await task.save();
    await updated.populate([
      { path: "assignedTo", select: "name email" },
      { path: "projectId", select: "title" },
    ]);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/tasks/:id
// @access Private (Admin only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/tasks/dashboard
// @access Private
const getDashboardStats = async (req, res) => {
  try {
    let tasks;
    const today = new Date();

    if (req.user.role === "admin") {
      const adminProjects = await Project.find({ createdBy: req.user._id }).select("_id");
      const projectIds = adminProjects.map((p) => p._id);
      tasks = await Task.find({ projectId: { $in: projectIds } })
        .populate("assignedTo", "name");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate("assignedTo", "name");
    }

    // Fix 3 — tasks per user
    const tasksPerUser = {};
    tasks.forEach((t) => {
      const name = t.assignedTo?.name || "Unassigned";
      tasksPerUser[name] = (tasksPerUser[name] || 0) + 1;
    });

    const stats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "To Do").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      done: tasks.filter((t) => t.status === "Done").length,
      overdue: tasks.filter(
        (t) => new Date(t.dueDate) < today && t.status !== "Done"
      ).length,
      tasksPerUser, // Fix 3 — added
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getDashboardStats };
