const express = require('express');
const protect = require('../middleware/auth.middleware');
const { sendRequest, getRequests, updateRequest, getSentRequests, getRoomInfo } = require('../controllers/request.controller');



const router = express.Router();

router.post('/', protect, sendRequest);
router.get('/', protect, getRequests);
router.get('/sent', protect, getSentRequests);
router.get('/room/:id', protect, getRoomInfo);
router.put('/:id', protect, updateRequest);

module.exports = router;