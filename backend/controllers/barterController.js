const Barter = require('../models/Barter');

// @desc    Create a new barter request
// @route   POST /api/barter
// @access  Private
exports.createBarterRequest = async (req, res) => {
  try {
    const { productOffered, productRequested, offeredTo } = req.body;
    const offeredBy = req.user._id;

    if (!productOffered || !productRequested || !offeredTo) {
      return res.status(400).json({ message: 'productOffered, productRequested, and offeredTo are required' });
    }

    // Optional: add validation to check if products exist and belong to correct owners
    // Optional: check if a pending request already exists between these products

    const barter = await Barter.create({
      productOffered,
      productRequested,
      offeredBy,
      offeredTo
    });

    res.status(201).json(barter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept or reject a barter request
// @route   PUT /api/barter/:id
// @access  Private
exports.updateBarterStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const barterId = req.params.id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be accepted or rejected' });
    }

    const barter = await Barter.findById(barterId);

    if (!barter) {
      return res.status(404).json({ message: 'Barter request not found' });
    }

    // Only the user to whom the offer is made can accept/reject
    if (barter.offeredTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this barter request' });
    }

    barter.status = status;
    const updatedBarter = await barter.save();

    res.json(updatedBarter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's barter requests (both sent and received)
// @route   GET /api/barter
// @access  Private
exports.getUserBarters = async (req, res) => {
  try {
    const userId = req.user._id;

    // Retrieve all barters where user is either the sender or receiver
    const barters = await Barter.find({
      $or: [{ offeredBy: userId }, { offeredTo: userId }]
    })
      .populate('productOffered', 'name price image') // Adjust fields based on Product model
      .populate('productRequested', 'name price image')
      .populate('offeredBy', 'name email')
      .populate('offeredTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(barters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
