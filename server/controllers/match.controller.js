const User = require('../models/User');

const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const matches = await User.find({
      _id: { $ne: req.user.id },
      skillsOffered: { $in: currentUser.skillsWanted },
      skillsWanted: { $in: currentUser.skillsOffered },
    }).select('-password');

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMatches };