const Joi = require('joi');
const { TRANSACTION_TYPES, CATEGORIES } = require('../config/constants');

const createTransactionSchema = Joi.object({
  amount: Joi.number().min(0.01).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  }),
  type: Joi.string()
    .valid(...Object.values(TRANSACTION_TYPES))
    .required()
    .messages({
      'any.only': `Type must be one of: ${Object.values(TRANSACTION_TYPES).join(', ')}`,
      'any.required': 'Type is required'
    }),
  category: Joi.string()
    .valid(...CATEGORIES)
    .required()
    .messages({
      'any.only': `Category must be one of: ${CATEGORIES.join(', ')}`,
      'any.required': 'Category is required'
    }),
  date: Joi.date().optional(),
  notes: Joi.string().max(500).optional().allow('')
});

const updateTransactionSchema = Joi.object({
  amount: Joi.number().min(0.01).optional(),
  type: Joi.string()
    .valid(...Object.values(TRANSACTION_TYPES))
    .optional(),
  category: Joi.string()
    .valid(...CATEGORIES)
    .optional(),
  date: Joi.date().optional(),
  notes: Joi.string().max(500).optional().allow('')
});

module.exports = { createTransactionSchema, updateTransactionSchema };