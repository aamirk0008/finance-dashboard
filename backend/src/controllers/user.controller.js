const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAllUsers = asyncHandler(async (req, res, next) => {
  const result = await userService.getAllUsers(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Users fetched successfully'));
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

const updateRole = asyncHandler(async (req, res, next) => {
  const user = await userService.updateRole(req.params.id, req.body.role, req.user._id);
  res.status(200).json(new ApiResponse(200, user, 'Role updated successfully'));
});

const updateStatus = asyncHandler(async (req, res, next) => {
  const user = await userService.updateStatus(req.params.id, req.body.isActive, req.user._id);
  res.status(200).json(new ApiResponse(200, user, 'Status updated successfully'));
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const result = await userService.deleteUser(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, result, 'User deleted successfully'));
});

module.exports = { getAllUsers, getUserById, updateRole, updateStatus, deleteUser };