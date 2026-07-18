const { processCommand } = require('../services/assistance.service');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const handleCommand = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return next(new ApiError(400, 'Message is required'));
  }

  const result = await processCommand(message, req.user._id);
  res.status(200).json(new ApiResponse(200, result, 'Command processed'));
});

module.exports = { handleCommand };