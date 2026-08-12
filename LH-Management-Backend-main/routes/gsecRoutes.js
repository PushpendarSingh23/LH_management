const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddlewares');
const gsecController = require('../controllers/gsecController');

router.post('/makerequest', authenticate, authorize(['gsec']), gsecController.makeRequest);
router.get('/myapprovedrequests', authenticate, authorize(['gsec']), gsecController.getAllRequestsByMe);

module.exports = router;
