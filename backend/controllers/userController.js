const User = require("../models/User");

// @route  GET /api/users
// @access Private (Admin only) — used to populate member dropdowns
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers };
