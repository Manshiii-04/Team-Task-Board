const express = require('express');
const { signup, login, searchUsers } = require('../Controllers/authController');
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get("/search", protect, authorize("admin"), searchUsers);

module.exports = router;
