const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddlewares');
const guardController = require('../controllers/guardController');

router.get('/approvedrequests', authenticate, authorize(['systemAdministrator', 'assistantRegistrar', 'guard', 'facultyMentor', 'gsec']), guardController.getApprovedRequests);

module.exports = router;
