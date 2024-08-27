const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailControllers')

router.post('/send_landing_email', emailController.sendLandingEmail)

module.exports = router