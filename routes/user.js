const express = require('express')
const { addPrjToUser} = require ('../controllers/userController') 
const { user } = require('../controllers/userController')

const router = express.Router();

router.get('/user',user);
router.post('/user/add', addPrjToUser)

module.exports = router;

