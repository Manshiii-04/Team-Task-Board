const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user
    });

  } catch (error) {
    console.log("CREATE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createUser
};