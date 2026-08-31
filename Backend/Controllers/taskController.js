const Task = require("../models/Task");

// GET /api/tasks
async function getTasks(req, res) {
  try {
    const query = req.user.role === "admin" ? {} : { assignee: req.user.id };
    const tasks = await Task.find(query)
      .populate("assignee", "name email")
      .populate("createdBy", "name email");
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    return res.status(500).json({ message: "Server error fetching tasks" });
  }
}

// POST /api/tasks (admin only)
async function createTask(req, res) {
  try {
    const { title, description, status, assignee } = req.body;
    if (!title && !description && !status && !assignee) {
      return res.status(400).json({ message: "All data required" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      assignee: assignee || null,
      createdBy: req.user.id,
    });

    const populated = await task.populate([
      { path: "assignee", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);

    return res.status(201).json(populated);
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({ message: "Server error creating task" });
  }
}

// PUT /api/tasks/:id (admin only)
async function updateTask(req, res) {
  try {
    const { title, description, status, assignee } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.assignee = assignee ?? task.assignee;

    await task.save();
    const populated = await task.populate([
      { path: "assignee", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);

    return res.status(200).json(populated);
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({ message: "Server error updating task" });
  }
}

// PATCH /api/tasks/:id/status (member: own task only; admin: any)
async function updateTaskStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ["Todo", "In Progress", "Done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.assignee && task.assignee.toString() === req.user.id;
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "You do not have permission to update this task" });
    }

    task.status = status;
    await task.save();
    const populated = await task.populate([
      { path: "assignee", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);

    return res.status(200).json(populated);
  } catch (error) {
    console.error("Update status error:", error);
    return res.status(500).json({ message: "Server error updating task status" });
  }
}

// DELETE /api/tasks/:id (admin only)
async function deleteTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ message: "Server error deleting task" });
  }
}

module.exports = { getTasks, createTask, updateTask, updateTaskStatus, deleteTask };