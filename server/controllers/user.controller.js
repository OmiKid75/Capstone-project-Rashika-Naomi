const User = require('../models/User');

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMe = async (req, res) => {
  try {
    const { skillsOffered, skillsWanted, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        skillsOffered: skillsOffered || [], 
        skillsWanted: skillsWanted || [],
        bio 
      },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMe, updateMe };