const Task = require("../models/Task");

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
  try {
    console.log("PATCH STATUS HIT");
    console.log("Task ID:", req.params.id);
    console.log("Body:", req.body);

    const task = await Task.findById(req.params.id);

    console.log("Task found:", task);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    task.status = req.body.status;

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: task
    });

  } catch (error) {
    console.log("PATCH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ASSIGN TASK
const assignTask = async (req, res) => {
  try {
    const { assignee } = req.body;

    if (!assignee) {
      return res.status(400).json({
        success: false,
        message: "Assignee is required"
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignee: assignee },
      {
        new: true,
        runValidators: true
      }
    ).populate("assignee", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      task
    });

  } catch (error) {
    console.log("ASSIGN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createTask,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask
};