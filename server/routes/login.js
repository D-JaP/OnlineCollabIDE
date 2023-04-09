const express = require('express');
const { login } = require('../controllers/authController');
const { authenticate } = require('../controllers/jwtAuthenticateController');

const router = express.Router();

router.post('/login', login);
router.post('/auth', authenticate)

module.exports = router;
