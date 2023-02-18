const express = require('express');
const router = express.Router();

const orderSummaryController = require('../../../controllers/api/v1/order_summary_controller');

router.post('/set-invoice-number', orderSummaryController.setInvoiceNumber);
router.post('/generate-invoice', orderSummaryController.invoiceGenerator);
router.get('/', orderSummaryController.getAllInvoice);


module.exports = router;