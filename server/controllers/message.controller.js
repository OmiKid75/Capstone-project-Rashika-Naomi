const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const saveMessage = async (req, res) => {
  try {
    const { roomId, text } = req.body;
    const message = await Message.create({
      roomId,
      sender: req.user.id,
      text,
    });
    const populated = await message.populate('sender', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMessages, saveMessage };