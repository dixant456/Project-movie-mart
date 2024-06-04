const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/signup', authController.Signup);
router.post('/login', authController.Login);
router.get('/getprofile', authController.profile);
router.get('/allow', authController.verifytoken);

module.exports = router;