const express = require('express');
const { register } = require('../controllers/registrationController');
const { activateAccount } = require('../controllers/activateTokenController')
const router = express.Router();

router.post('/registration', register);
router.post('/activate/:token', activateAccount)


module.exports = router;
