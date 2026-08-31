const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  // assignTask,
  deleteTask
} = require("../Controllers/taskController");

router.get("/", protect, getTasks);

router.post("/", protect, authorize('admin'), createTask);

router.put("/:id", protect, authorize('admin'), updateTask);

router.patch("/:id/status", protect, authorize('member'), updateTaskStatus);

// router.patch("/:id/assign", protect, authorize('admin'),  assignTask);

router.delete("/:id", protect, authorize('admin'),  deleteTask);

module.exports = router;