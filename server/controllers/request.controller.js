const Request = require('../models/Request');

const sendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;

    const existing = await Request.findOne({ from: req.user.id, to, status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const request = await Request.create({ from: req.user.id, to, message });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ to: req.user.id })
      .populate('from', 'name email skillsOffered skillsWanted')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ from: req.user.id })
      .populate('to', 'name email skillsOffered skillsWanted')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRoomInfo = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ from: request.from.toString(), to: request.to.toString() });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sendRequest, getRequests, updateRequest, getSentRequests, getRoomInfo };
