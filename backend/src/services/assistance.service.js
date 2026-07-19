const mongoose = require('mongoose');
const { GoogleGenAI } = require('@google/genai');
const Transaction = require('../models/Transaction');
const { CATEGORIES } = require('../config/constants');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const parseIntent = async (message, userId) => {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const prompt = `
You are a financial transaction assistant. Parse the user's message and return ONLY a valid JSON object with no markdown, no backticks, no explanation.

Today's date: ${today}
Current month: ${currentMonth}
Current year: ${currentYear}

Valid categories: ${CATEGORIES.join(', ')}
Valid types: income, expense

Determine the action and return one of these JSON structures:

For CREATE:
{"action":"create","intent":"brief description","message":"confirmation message","data":{"amount":number,"type":"income|expense","category":"valid_category","date":"YYYY-MM-DD","notes":"optional"}}

For READ:
{"action":"read","intent":"brief description","message":"searching message","filters":{"type":"income|expense|null","category":"category|null","startDate":"YYYY-MM-DD|null","endDate":"YYYY-MM-DD|null","limit":10}}

For UPDATE:
{"action":"update","intent":"brief description","message":"confirmation message","findBy":{"type":"income|expense|null","category":"category|null","position":"last|first"},"updateData":{"amount":number|null,"notes":"string|null","category":"string|null","date":"YYYY-MM-DD|null"}}

For DELETE:
{"action":"delete","intent":"brief description","message":"confirmation message","findBy":{"type":"income|expense|null","category":"category|null","position":"last|first"}}

For SUMMARY:
{"action":"summary","intent":"brief description","message":"calculating message","filters":{"type":"income|expense|null","category":"category|null","startDate":"YYYY-MM-DD|null","endDate":"YYYY-MM-DD|null"}}

For anything unclear:
{"action":"unknown","message":"friendly message asking for clarification"}

User message: "${message}"

Return ONLY the JSON object:
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  const text = response.text.trim();
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

const executeAction = async (parsed, userId) => {
  switch (parsed.action) {

    case 'create': {
      const transaction = await Transaction.create({
        ...parsed.data,
        createdBy: new mongoose.Types.ObjectId(userId),
      });
      return {
        success: true,
        action: 'create',
        message: parsed.message,
        transaction,
        display: {
          type: 'created',
          data: transaction
        }
      };
    }

    case 'read': {
      const filter = { isDeleted: false, createdBy: new mongoose.Types.ObjectId(userId) };
      const { type, category, startDate, endDate, limit } = parsed.filters;
      if (type) filter.type = type;
      if (category) filter.category = category;
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      const transactions = await Transaction.find(filter)
        .sort({ date: -1 })
        .limit(limit || 10);

      return {
        success: true,
        action: 'read',
        message: parsed.message,
        transactions,
        display: {
          type: 'list',
          data: transactions,
          count: transactions.length
        }
      };
    }

    case 'update': {
      const filter = { isDeleted: false, createdBy: new mongoose.Types.ObjectId(userId) };
      const { type, category, position } = parsed.findBy;
      if (type) filter.type = type;
      if (category) filter.category = category;

      const sort = position === 'first' ? { date: 1 } : { date: -1 };
      const transaction = await Transaction.findOne(filter).sort(sort);

      if (!transaction) {
        return {
          success: false,
          action: 'update',
          message: 'No matching transaction found to update.'
        };
      }

      const updateFields = {};
      if (parsed.updateData.amount) updateFields.amount = parsed.updateData.amount;
      if (parsed.updateData.notes) updateFields.notes = parsed.updateData.notes;
      if (parsed.updateData.category) updateFields.category = parsed.updateData.category;
      if (parsed.updateData.date) updateFields.date = parsed.updateData.date;

      const updated = await Transaction.findByIdAndUpdate(
        transaction._id,
        { $set: updateFields },
        { new: true }
      );

      return {
        success: true,
        action: 'update',
        message: parsed.message,
        transaction: updated,
        display: {
          type: 'updated',
          data: updated
        }
      };
    }

    case 'delete': {
      const filter = { isDeleted: false, createdBy: new mongoose.Types.ObjectId(userId) };
      const { type, category, position } = parsed.findBy;
      if (type) filter.type = type;
      if (category) filter.category = category;

      const sort = position === 'first' ? { date: 1 } : { date: -1 };
      const transaction = await Transaction.findOne(filter).sort(sort);

      if (!transaction) {
        return {
          success: false,
          action: 'delete',
          message: 'No matching transaction found to delete.'
        };
      }

      await Transaction.findByIdAndUpdate(transaction._id, { isDeleted: true });

      return {
        success: true,
        action: 'delete',
        message: parsed.message,
        transaction,
        display: {
          type: 'deleted',
          data: transaction
        }
      };
    }

    case 'summary': {
      const filter = { isDeleted: false, createdBy: new mongoose.Types.ObjectId(userId) };
      const { type, category, startDate, endDate } = parsed.filters;
      if (type) filter.type = type;
      if (category) filter.category = category;
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      const result = await Transaction.aggregate([
        { $match: { ...filter, createdBy: userId } },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);

      let totalIncome = 0, totalExpenses = 0, incomeCount = 0, expenseCount = 0;
      result.forEach(r => {
        if (r._id === 'income') { totalIncome = r.total; incomeCount = r.count; }
        if (r._id === 'expense') { totalExpenses = r.total; expenseCount = r.count; }
      });

      return {
        success: true,
        action: 'summary',
        message: parsed.message,
        display: {
          type: 'summary',
          data: {
            totalIncome,
            totalExpenses,
            netBalance: totalIncome - totalExpenses,
            incomeCount,
            expenseCount
          }
        }
      };
    }

    case 'unknown':
    default:
      return {
        success: false,
        action: 'unknown',
        message: parsed.message || "I didn't understand that. Try something like 'Add food expense of 500' or 'Show my rent transactions'."
      };
  }
};

const processCommand = async (message, userId) => {
  try {
    const parsed = await parseIntent(message, userId);
    const result = await executeAction(parsed, userId);
    return result;
  } catch (error) {
    const errMsg = error.message || '';
    if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      return {
        success: false,
        action: 'error',
        code: 'RATE_LIMIT',
        message: 'Daily AI limit reached. Please try again tomorrow.'
      };
    }
    if (errMsg.includes('503')) {
      return {
        success: false,
        action: 'error',
        code: 'OVERLOADED',
        message: 'AI is overloaded. Please try again in a moment.'
      };
    }
    return {
      success: false,
      action: 'error',
      code: 'UNKNOWN',
      message: 'Something went wrong. Please try again.'
    };
  }
};

module.exports = { processCommand };