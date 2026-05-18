const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, chatController.sendMessage);

module.exports = router;