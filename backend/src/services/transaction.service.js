const Transaction = require('../models/Transaction');
const ApiError = require('../utils/ApiError');

const createTransaction = async (data, userId) => {
  const transaction = await Transaction.create({
    ...data,
    createdBy: userId
  });
  return transaction;
};

const getAllTransactions = async (query) => {
  const {
    type,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10
  } = query;

  const filter = { isDeleted: false };

  if (type) filter.type = type;
  if (category) filter.category = category;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate('createdBy', 'name email role')
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: -1 }),
    Transaction.countDocuments(filter)
  ]);

  return {
    transactions,
    pagination: {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getTransactionById = async (id) => {
  const transaction = await Transaction.findOne({
    _id: id,
    isDeleted: false
  }).populate('createdBy', 'name email role');

  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }

  return transaction;
};

const updateTransaction = async (id, data) => {
  const transaction = await Transaction.findOne({ _id: id, isDeleted: false });

  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }

  const updated = await Transaction.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );

  return updated;
};

const deleteTransaction = async (id) => {
  const transaction = await Transaction.findOne({ _id: id, isDeleted: false });

  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }

  await Transaction.findByIdAndUpdate(id, { isDeleted: true });

  return { message: 'Transaction deleted successfully' };
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};