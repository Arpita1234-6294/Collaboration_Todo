// routes/logRoutes.js

const express = require('express');
const router = express.Router();

const { getLatestlogs } = require('../controllers/logController');
const { verifyToken } = require('../middleware/authMiddleware');

// @route GET /api/logs/latest
router.get('/latest', verifyToken, getLatestlogs);

module.exports = router;
