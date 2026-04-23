const express = require('express');
const { getMessages, saveMessage } = require('../controllers/message.controller');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:roomId', protect, getMessages);
router.post('/', protect, saveMessage);

module.exports = router;