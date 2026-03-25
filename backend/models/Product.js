const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a product title'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair'],
    required: [true, 'Please specify the condition']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a seller ID']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
