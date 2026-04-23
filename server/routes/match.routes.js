const express = require('express');
const { getMatches } = require('../controllers/match.controller');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, getMatches);

module.exports = router;