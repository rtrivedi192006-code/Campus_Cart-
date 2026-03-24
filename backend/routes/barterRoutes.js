const express = require('express');
const { createBarterRequest, updateBarterStatus, getUserBarters } = require('../controllers/barterController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createBarterRequest);
router.put('/:id', protect, updateBarterStatus);
router.get('/', protect, getUserBarters);

module.exports = router;
