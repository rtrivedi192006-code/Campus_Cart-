const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Supports both styles (REST and fallback from mobile)
router.post('/', protect, sendMessage);
router.post('/send-message', protect, sendMessage);
router.get('/:userId', protect, getMessages);

module.exports = router;
