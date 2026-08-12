const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddlewares');
const facultyMentorController = require('../controllers/facultyMentorController');

router.get('/allrequests', authenticate, authorize(['facultyMentor']), facultyMentorController.getAllRequests);
router.put('/reviewed', authenticate, authorize(['facultyMentor']), facultyMentorController.approveOrReject);

module.exports = router;
