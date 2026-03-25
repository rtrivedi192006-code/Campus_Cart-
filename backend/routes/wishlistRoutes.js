const express = require('express');
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All wishlist routes are protected
router.use(protect);

// GET /api/wishlist - Get user's wishlist
router.get('/', getWishlist);

// POST /api/wishlist/:productId - Add product to wishlist
router.post('/:productId', addToWishlist);

// DELETE /api/wishlist/:productId - Remove product from wishlist
router.delete('/:productId', removeFromWishlist);

module.exports = router;
