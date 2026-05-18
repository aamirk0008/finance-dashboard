const chatService = require('../services/chat.service');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const sendMessage = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return next(new ApiError(400, 'Message is required'));
  }

  const response = await chatService.chat(message, req.user._id);
  res.status(200).json(new ApiResponse(200, { response }, 'Message sent successfully'));
});

module.exports = { sendMessage };