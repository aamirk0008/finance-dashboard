const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createTransactionSchema,
  updateTransactionSchema
} = require('../validators/transaction.validator');

// All routes require login
router.use(protect);

// Read — analyst and admin
router.get('/', requireRole('admin', 'analyst'), transactionController.getAllTransactions);
router.get('/:id', requireRole('admin', 'analyst'), transactionController.getTransactionById);

// Write — admin only
router.post('/', requireRole('admin'), validate(createTransactionSchema), transactionController.createTransaction);
router.put('/:id', requireRole('admin'), validate(updateTransactionSchema), transactionController.updateTransaction);
router.delete('/:id', requireRole('admin'), transactionController.deleteTransaction);

module.exports = router;