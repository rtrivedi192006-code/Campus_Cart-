const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add product to wishlist
    user.wishlist.push(productId);
    await user.save();

    // Return updated wishlist with populated product info
    const updatedUser = await User.findById(userId).populate('wishlist');
    res.status(201).json({
      message: 'Product added to wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product is in wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(404).json({ message: 'Product not in wishlist' });
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    // Return updated wishlist with populated product info
    const updatedUser = await User.findById(userId).populate('wishlist');
    res.status(200).json({
      message: 'Product removed from wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all wishlist items for current user
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: 'wishlist',
      populate: {
        path: 'sellerId',
        select: 'name email'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
