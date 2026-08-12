const express = require('express');
const router = express.Router();
const systemAdministratorController = require('../controllers/systemAdministratorController');
const { authenticate, authorize } = require('../middlewares/authMiddlewares');

router.get('/allrequests', authenticate, authorize(['systemAdministrator']), systemAdministratorController.getAllRequest);
router.put('/reviewed', authenticate, authorize(['systemAdministrator']), systemAdministratorController.approveOrReject);

module.exports = router;
