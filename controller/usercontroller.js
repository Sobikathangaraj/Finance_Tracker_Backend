const User = require("../model/usermodel");
const bcrypt = require("bcryptjs");

// GET all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ result: users, message: "Users fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single user
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ result: user, message: "User fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE user role or status (admin only)
const updateUser = async (req, res) => {
  try {
    const { role, status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ result: user, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };