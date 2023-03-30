const express = require('express');
const { invite } = require('../controllers/inviteController');

const router = express.Router();

router.get('/invite', invite);

module.exports = router;
