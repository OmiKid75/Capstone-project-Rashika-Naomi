const express = require('express');
const { getMe, updateMe } = require('../controllers/user.controller');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;