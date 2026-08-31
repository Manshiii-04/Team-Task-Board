const express = require("express");

const router = express.Router();

const {
  createTask,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask
} = require("../Controllers/taskController");

router.post("/", createTask);

router.put("/:id", updateTask);

router.patch("/:id/status", updateTaskStatus);

router.patch("/:id/assign", assignTask);

router.delete("/:id", deleteTask);

module.exports = router;