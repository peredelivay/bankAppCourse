const express = require('express');
const { getProfile, transfer } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.post('/transfer', authMiddleware, transfer); // Перевод средств

module.exports = router;
