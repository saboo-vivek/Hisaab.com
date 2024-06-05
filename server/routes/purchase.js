const express = require('express');
const authmiddleware = require('../middleware/authentication')
const purchaseController = require('../controllers/purchase');

const router = express.Router();

router.get('/purchase/premium', authmiddleware.authenticate ,purchaseController.purchasepremium);

router.post('/purchase/updatetransactionstatus', authmiddleware.authenticate ,purchaseController.updatetransactionstatus);


module.exports = router ;