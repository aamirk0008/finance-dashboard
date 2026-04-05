const Transaction = require('../models/Transaction');

const getSummary = async () => {
  const result = await Transaction.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  result.forEach((item) => {
    if (item._id === 'income') {
      totalIncome = item.total;
      incomeCount = item.count;
    } else if (item._id === 'expense') {
      totalExpenses = item.total;
      expenseCount = item.count;
    }
  });

  const netBalance = totalIncome - totalExpenses;

  const recentTransactions = await Transaction.find({ isDeleted: false })
    .populate('createdBy', 'name email')
    .sort({ date: -1 })
    .limit(5);

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    incomeCount,
    expenseCount,
    totalTransactions: incomeCount + expenseCount,
    recentTransactions
  };
};

const getCategoryBreakdown = async () => {
  const result = await Transaction.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { category: '$category', type: '$type' },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.category',
        breakdown: {
          $push: {
            type: '$_id.type',
            total: '$total',
            count: '$count'
          }
        },
        categoryTotal: { $sum: '$total' }
      }
    },
    { $sort: { categoryTotal: -1 } }
  ]);

  return result.map((item) => ({
    category: item._id,
    categoryTotal: item.categoryTotal,
    breakdown: item.breakdown
  }));
};

const getMonthlyTrends = async (year) => {
  const selectedYear = parseInt(year) || new Date().getFullYear();

  const result = await Transaction.aggregate([
    {
      $match: {
        isDeleted: false,
        date: {
          $gte: new Date(`${selectedYear}-01-01`),
          $lte: new Date(`${selectedYear}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.month': 1 } }
  ]);

  // Build 12 month structure
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const trends = months.map((month, index) => {
    const monthNumber = index + 1;

    const incomeData = result.find(
      (r) => r._id.month === monthNumber && r._id.type === 'income'
    );
    const expenseData = result.find(
      (r) => r._id.month === monthNumber && r._id.type === 'expense'
    );

    const income = incomeData ? incomeData.total : 0;
    const expenses = expenseData ? expenseData.total : 0;

    return {
      month,
      monthNumber,
      income,
      expenses,
      net: income - expenses
    };
  });

  return { year: selectedYear, trends };
};

module.exports = { getSummary, getCategoryBreakdown, getMonthlyTrends };