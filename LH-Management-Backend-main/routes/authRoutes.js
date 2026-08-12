// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');

router.post('/signup',userAuthController.signup);
router.post('/login', userAuthController.login);
router.get('/logout', userAuthController.logout);

module.exports = router;
