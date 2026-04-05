const dashboardService = require('../services/dashboard.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getSummary = asyncHandler(async (req, res, next) => {
  const data = await dashboardService.getSummary();
  res.status(200).json(new ApiResponse(200, data, 'Summary fetched successfully'));
});

const getCategoryBreakdown = asyncHandler(async (req, res, next) => {
  const data = await dashboardService.getCategoryBreakdown();
  res.status(200).json(new ApiResponse(200, data, 'Category breakdown fetched successfully'));
});

const getMonthlyTrends = asyncHandler(async (req, res, next) => {
  const data = await dashboardService.getMonthlyTrends(req.query.year);
  res.status(200).json(new ApiResponse(200, data, 'Monthly trends fetched successfully'));
});

module.exports = { getSummary, getCategoryBreakdown, getMonthlyTrends };