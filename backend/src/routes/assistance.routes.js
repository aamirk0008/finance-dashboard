const express = require('express');
const router = express.Router();
const { handleCommand } = require('../controllers/assistance.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/', protect, requireRole('admin'), handleCommand);

module.exports = router;