// routes/authRoutes.js
const express = require('express');
const router = express.Router();
// const authMiddlewares = require('../middlewares/authMiddlewares')
const userAuthController = require('../controllers/userAuthController');
const  authenticate  = require('../middlewares/authMiddlewares');

router.post('/signup',userAuthController.signup);
router.post('/login', userAuthController.login);
router.get('/logout', userAuthController.logout);

module.exports = router;
