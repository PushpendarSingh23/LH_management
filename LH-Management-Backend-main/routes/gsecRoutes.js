const express = require('express');
const router = express.Router();
const {authenticate, authorize} = require('../middlewares/authMiddlewares');

const roleMiddleware = require('../middlewares/roleBasedMiddlewares')
const gsecController = require('../controllers/gsecController')


router.post('/makerequest', authenticate, roleMiddleware(['gsec']), gsecController.makeRequest);
router.get('/myapprovedrequests', authenticate, roleMiddleware(['gsec']), gsecController.getAllRequestsByMe);
// router.get('/mypendingrequests', authenticate, roleMiddleware(['gsec']), gsecController.getPendingRequestsByMe);
// router.get('/myrejectedrequests', authenticate, roleMiddleware(['gsec']), gsecController.getRejectedRequestsByMe);
  module.exports = router;