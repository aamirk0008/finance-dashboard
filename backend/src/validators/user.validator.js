const Joi = require('joi');
const { ROLES } = require('../config/constants');

const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      'any.only': `Role must be one of: ${Object.values(ROLES).join(', ')}`,
      'any.required': 'Role is required'
    })
});

const updateStatusSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    'any.required': 'isActive is required',
    'boolean.base': 'isActive must be a boolean'
  })
});

module.exports = { updateRoleSchema, updateStatusSchema };