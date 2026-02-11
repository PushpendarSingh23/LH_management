const express = require('express');
const router = express.Router();
const {authorize , authenticate} = require('../middlewares/authMiddlewares');
const roleMiddleware = require('../middlewares/roleBasedMiddlewares')
const assistantRegistrarController = require('../controllers/assistantRegistrarController')


router.get('/allrequests', authenticate, roleMiddleware(['assistantRegistrar']), assistantRegistrarController.getAllRequests);

router.put('/reviewed', authenticate, roleMiddleware(['assistantRegistrar']), assistantRegistrarController.approveOrReject);

  module.exports = router;