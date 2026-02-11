const express = require('express');
const router = express.Router();
const {authenticate, authorize} = require('../middlewares/authMiddlewares');

const roleMiddleware = require('../middlewares/roleBasedMiddlewares')
const guardController = require('../controllers/guardController')


router.get('/approvedrequests', authenticate, roleMiddleware(['systemAdministrator', 'assistantRegistrar', 'guard', 'facultyMentor', 'gsec']), guardController.getApprovedRequests);




  module.exports = router;