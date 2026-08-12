const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddlewares');
const assistantRegistrarController = require('../controllers/assistantRegistrarController');

router.get('/allrequests', authenticate, authorize(['assistantRegistrar']), assistantRegistrarController.getAllRequests);
router.put('/reviewed', authenticate, authorize(['assistantRegistrar']), assistantRegistrarController.approveOrReject);

module.exports = router;
