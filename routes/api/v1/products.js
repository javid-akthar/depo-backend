const express = require('express');
const router = express.Router();

const productsController = require('../../../controllers/api/v1/products_controller');

router.get('/', productsController.getProducts);
router.get('/add', productsController.addProducts);
module.exports = router;