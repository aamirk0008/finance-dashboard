const ApiError = require('../utils/ApiError');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return next(new ApiError(400, 'Validation Error', errors));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { validate };