const express = require('express');
const { createReview, getUserReviews } = require('../controllers/review.controller');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/:userId', protect, getUserReviews);

module.exports = router;