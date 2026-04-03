const transactionService = require('../services/transaction.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await transactionService.createTransaction(
    req.body,
    req.user._id
  );
  res.status(201).json(new ApiResponse(201, transaction, 'Transaction created successfully'));
});

const getAllTransactions = asyncHandler(async (req, res, next) => {
  const result = await transactionService.getAllTransactions(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Transactions fetched successfully'));
});

const getTransactionById = asyncHandler(async (req, res, next) => {
  const transaction = await transactionService.getTransactionById(req.params.id);
  res.status(200).json(new ApiResponse(200, transaction, 'Transaction fetched successfully'));
});

const updateTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await transactionService.updateTransaction(
    req.params.id,
    req.body
  );
  res.status(200).json(new ApiResponse(200, transaction, 'Transaction updated successfully'));
});

const deleteTransaction = asyncHandler(async (req, res, next) => {
  const result = await transactionService.deleteTransaction(req.params.id);
  res.status(200).json(new ApiResponse(200, result, 'Transaction deleted successfully'));
});

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};