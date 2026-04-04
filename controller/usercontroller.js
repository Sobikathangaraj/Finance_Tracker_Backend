const User = require("../model/user");

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

// UPDATE user role + status (admin only)
const updateUser = async (req, res) => {
  try {
    const { role, status } = req.body;

    const updateFields = {};
    if (role) {
      if (!["admin", "analyst", "viewer"].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be admin, analyst or viewer" });
      }
      updateFields.role = role;
    }
    if (status) {
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be active or inactive" });
      }
      updateFields.status = status;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
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
