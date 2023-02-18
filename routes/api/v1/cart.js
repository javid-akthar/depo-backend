const express = require("express");
const router = express.Router();

const cartItemController = require("../../../controllers/api/v1/cart_controller");

router.post("/add", cartItemController.add);
router.post("/update", cartItemController.update);
router.get("/delete/:productid", cartItemController.delete);
router.post("/place-order", cartItemController.placeOrder);
router.get("/",cartItemController.getCartItems);
module.exports = router;
