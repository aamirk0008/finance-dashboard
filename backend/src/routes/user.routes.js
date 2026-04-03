const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { updateRoleSchema, updateStatusSchema } = require('../validators/user.validator');

const adminOnly = [protect, requireRole('admin')];

router.get('/', ...adminOnly, userController.getAllUsers);
router.get('/:id', ...adminOnly, userController.getUserById);
router.patch('/:id/role', ...adminOnly, validate(updateRoleSchema), userController.updateRole);
router.patch('/:id/status', ...adminOnly, validate(updateStatusSchema), userController.updateStatus);
router.delete('/:id', ...adminOnly, userController.deleteUser);

module.exports = router;