const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    console.log('[messageController] sendMessage received', {
      senderId: senderId.toString(),
      receiverId,
      text
    });

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver ID and text are required' });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text
    });

    console.log('[messageController] sendMessage saved', message._id);

    res.status(201).json(message);
  } catch (error) {
    console.error('[messageController] sendMessage error', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.user._id;

    console.log('[messageController] getMessages', {
      currentUserId: currentUserId.toString(),
      otherUserId
    });

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 }); // Sort by time ascending

    res.json(messages);
  } catch (error) {
    console.error('[messageController] getMessages error', error);
    res.status(500).json({ message: error.message });
  }
};
