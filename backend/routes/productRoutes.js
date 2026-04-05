console.log("✅ Product Routes Loaded");
const express = require('express');
const {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', (req, res) => {
  console.log("🔥 GET /api/products HIT");
  res.send("Products route working");
});

// POST /api/products (protected)
router.post('/', protect, addProduct);

// GET /api/products
router.get('/', getAllProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// DELETE /api/products/:id (protected)
router.delete('/:id', protect, deleteProduct);

module.exports = router;
