const Review = require('../models/Review');

const createReview = async (req, res) => {
  try {
    const { reviewee, request, rating, comment } = req.body;

    const existing = await Review.findOne({ reviewer: req.user.id, request });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this exchange' });
    }

    const review = await Review.create({
      reviewer: req.user.id,
      reviewee,
      request,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    res.json({ reviews, avgRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createReview, getUserReviews };