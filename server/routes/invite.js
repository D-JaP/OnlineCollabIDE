const express = require('express');
const { invite } = require('../controllers/inviteController');

const router = express.Router();

router.post('/invite', invite);

module.exports = router;
