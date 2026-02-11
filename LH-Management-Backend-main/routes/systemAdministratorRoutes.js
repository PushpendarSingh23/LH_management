const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middlewares/roleBasedMiddlewares')
const systemAdministratorController = require('../controllers/systemAdministratorController')
const {authenticate,authorize} = require('../middlewares/authMiddlewares');

// router.get('/pendingrequests', authenticate, roleMiddleware(['systemAdministrator']), systemAdministratorController.getPendingRequests);
// router.get('/approvedrequests', authenticate, roleMiddleware(['systemAdministrator']), systemAdministratorController.getApprovedRequests);
router.get('/allrequests', authenticate, roleMiddleware(['systemAdministrator']), systemAdministratorController.getAllRequest);
router.put('/reviewed', authenticate, roleMiddleware(['systemAdministrator']), systemAdministratorController.approveOrReject);


  module.exports = router;