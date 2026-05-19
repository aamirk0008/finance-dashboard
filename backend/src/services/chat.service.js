const { GoogleGenAI } = require('@google/genai');
const Transaction = require('../models/Transaction');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getFinancialContext = async (userId) => {
  const summaryData = await Transaction.aggregate([
    { $match: { isDeleted: false, createdBy: userId } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  let totalIncome = 0, totalExpenses = 0, incomeCount = 0, expenseCount = 0;

  summaryData.forEach((item) => {
    if (item._id === 'income') { totalIncome = item.total; incomeCount = item.count; }
    if (item._id === 'expense') { totalExpenses = item.total; expenseCount = item.count; }
  });

  const netBalance = totalIncome - totalExpenses;
  const ratio = totalExpenses > 0 ? (totalIncome / totalExpenses).toFixed(2) : null;

  let healthScore = 'No Data';
  if (ratio >= 2) healthScore = 'Excellent';
  else if (ratio >= 1.5) healthScore = 'Good';
  else if (ratio >= 1) healthScore = 'Fair';
  else if (ratio) healthScore = 'Poor';

  const categories = await Transaction.aggregate([
    { $match: { isDeleted: false, createdBy: userId } },
    {
      $group: {
        _id: { category: '$category', type: '$type' },
        total: { $sum: '$amount' }
      }
    },
    {
      $group: {
        _id: '$_id.category',
        categoryTotal: { $sum: '$total' },
        breakdown: { $push: { type: '$_id.type', total: '$total' } }
      }
    },
    { $sort: { categoryTotal: -1 } }
  ]);

  const recentTransactions = await Transaction.find({
    isDeleted: false, createdBy: userId
  })
    .sort({ date: -1 })
    .limit(10)
    .select('amount type category date notes');

  const currentYear = new Date().getFullYear();

  const monthlyTrends = await Transaction.aggregate([
    {
      $match: {
        isDeleted: false, createdBy: userId,
        date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.month': 1 } }
  ]);

  return {
    totalIncome, totalExpenses, netBalance,
    incomeCount, expenseCount,
    totalTransactions: incomeCount + expenseCount,
    ratio, healthScore, categories,
    recentTransactions, monthlyTrends, year: currentYear
  };
};

const chat = async (message, userId) => {
  const context = await getFinancialContext(userId);

  const prompt = `
You are a smart financial assistant for a personal finance dashboard called FinanceOS.
You have access to the user's real financial data provided below.
Answer questions based on this data when relevant.
For general finance questions not related to their data, provide helpful financial advice.
Always be concise, friendly, and format numbers in Indian Rupee (₹) format.
If asked about something you don't have data for, say so honestly.

USER'S FINANCIAL DATA:
- Total Income: ₹${context.totalIncome.toLocaleString('en-IN')}
- Total Expenses: ₹${context.totalExpenses.toLocaleString('en-IN')}
- Net Balance: ₹${context.netBalance.toLocaleString('en-IN')}
- Total Transactions: ${context.totalTransactions} (${context.incomeCount} income, ${context.expenseCount} expense)
- Financial Health Score: ${context.healthScore} (ratio: ${context.ratio}x)

CATEGORY BREAKDOWN:
${context.categories.map(c => `- ${c._id}: ₹${c.categoryTotal.toLocaleString('en-IN')}`).join('\n')}

RECENT TRANSACTIONS (last 10):
${context.recentTransactions.map(t =>
  `- ${t.type.toUpperCase()} | ${t.category} | ₹${t.amount.toLocaleString('en-IN')} | ${new Date(t.date).toLocaleDateString('en-IN')}`
).join('\n')}

MONTHLY TRENDS (${context.year}):
${context.monthlyTrends.map(t =>
  `- Month ${t._id.month} | ${t._id.type} | ₹${t.total.toLocaleString('en-IN')}`
).join('\n')}

User question: ${message}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text;
};

module.exports = { chat };