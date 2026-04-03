const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res, next) => {
  const result = await authService.register(req.body);
  res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
});

const login = asyncHandler(async (req, res, next) => {
  const result = await authService.login(req.body);
  res.status(200).json(new ApiResponse(200, result, 'Login successful'));
});

const getMe = asyncHandler(async (req, res, next) => {
  const user = await authService.getMe(req.user._id);
  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

module.exports = { register, login, getMe };