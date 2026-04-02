const User = require("../models/User");
const logger = require("../utils/logger");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").lean();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    logger.info(`Profile updated for user: ${user.email}`);

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getProfile, updateProfile };
