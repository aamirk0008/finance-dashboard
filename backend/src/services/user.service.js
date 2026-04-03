const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const getAllUsers = async (query) => {
  const { role, isActive, page = 1, limit = 10 } = query;

  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(filter)
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const updateRole = async (id, role, currentUserId) => {
  if (id === currentUserId.toString()) {
    throw new ApiError(400, 'You cannot change your own role');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.role = role;
  await user.save();
  return user;
};

const updateStatus = async (id, isActive, currentUserId) => {
  if (id === currentUserId.toString()) {
    throw new ApiError(400, 'You cannot deactivate your own account');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isActive = isActive;
  await user.save();
  return user;
};

const deleteUser = async (id, currentUserId) => {
  if (id === currentUserId.toString()) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await User.findByIdAndDelete(id);
  return { message: 'User deleted successfully' };
};

module.exports = { getAllUsers, getUserById, updateRole, updateStatus, deleteUser };