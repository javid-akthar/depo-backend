const mongoose = require("mongoose");
const Products = require("../../../models/products");
const CartItem = require("../../../models/CartItem");
const OrderSummary = require("../../../models/OrderSummary");
const InvoiceNumber = require("../../../models/invoiceNumber");
const orderSummaryController = require("./order_summary_controller");

module.exports.update = async function (req, res) {
  try {
    console.log("req.body", req.body);
    let prevRecord = await CartItem.findOne(req.body);
    // .populate("productId");
    if (prevRecord) {
      console.log("prevRecord", prevRecord.productId);
      let count = prevRecord.quantity;
      if (req.body.action == "increase") {
        count++;
      } else if (req.body.action == "decrease") {
        count--;
      }
      if (count <= 0) {
        await CartItem.findOneAndDelete({ productId: req.body.productId });
      }
      await CartItem.findOneAndUpdate(
        { productId: req.body.productId },
        { quantity: count }
      );
      return res.json({ status: "success" });
    } else {
      await CartItem.create({ productId: req.body.productId, quantity: 1 });
      return res.json({ status: "success" });
    }
  } catch (err) {
    console.log(err);
    return res.json({ status: "failure" });
  }
};

module.exports.add = async function (req, res) {
  try {
    console.log("req.body", req.body);
    await CartItem.create(req.body);

    return res.json({ status: "success" });
  } catch (err) {
    console.log(err);
    return res.json({ status: "failure" });
  }
};

module.exports.delete = async function (req, res) {
  try {
    console.log("req.params.productId", req.params.productid);
    await CartItem.findOneAndDelete({ productId: req.params.productid });
    return res.json({ status: "success" });
  } catch (err) {
    console.log(err);
    return res.json({ status: "failure" });
  }
};

module.exports.getCartItems = async function (req, res) {
  try {
    let cartList = await CartItem.find({});
    let obj = {};
    for (let i = 0; i < cartList.length; i++) {
      let prop = cartList[i].productId.toString();
      obj[prop] = cartList[i].quantity;
    }
    return res.json(obj);
  } catch (err) {
    console.log(err);
    return res.json({ status: "failure" });
  }
};

module.exports.placeOrder = async function (req, res) {
  console.log("req.body", req.body);
  let a = req.body.billingAddress.name.slice(0, 3);
  console.log("a", a);
  let b = req.body.billingAddress.state.slice(0, 3);
  console.log("b", b);
  try {
    let invoiceNumber = await InvoiceNumber.findOne({});
    console.log("previousInvoiceNumber", invoiceNumber.previousInvoiceNumber);
    let currInvoiceNumber = invoiceNumber.previousInvoiceNumber + 1;
    let invoiceId =
      a +
      "/" +
      b +
      "/" +
      "PI" +
      "/" +
      currInvoiceNumber.toString().padStart(5, "0");

    req.body.invoiceId = invoiceId;
    let orderItemDetails = req.body.orderItemDetails;
    let sum = 0;
    let priceWithoutGst = 0;
    let CGST9 = 0;
    let SGST9 = 0;
    console.log("orderItemDetails", orderItemDetails);
    for (let i = 0; i < orderItemDetails.length; i++) {
      let productId = orderItemDetails[i].productId;
      let quantity = orderItemDetails[i].quantity;
      let product = await Products.findById(productId);
      console.log("a", product);
      console.log("b", product.mrp);
      console.log("c", product.mrp.toString());
      console.log("d", parseFloat(product.mrp.toString()));
      let gst = parseFloat(product.gst_slab.toString());
      let price = parseFloat(product.mrp.toString()) * quantity;
      priceWithoutGst += price;
      price = price + (price / 100) * gst;
      console.log("price", price);
      sum += price;
      req.body.orderItemDetails[i].price = parseFloat(price).toFixed(2);
      req.body.orderItemDetails[i].cgstPer = (
        parseFloat(product.gst_slab.toString()) / 2
      ).toFixed(2);
      req.body.orderItemDetails[i].cgstAmt = (
        (price / 100) *
        (parseFloat(product.gst_slab.toString()) / 2)
      ).toFixed(2);
      req.body.orderItemDetails[i].sgstPer = (
        parseFloat(product.gst_slab.toString()) / 2
      ).toFixed(2);
      req.body.orderItemDetails[i].sgstAmt = (
        (price / 100) *
        (parseFloat(product.gst_slab.toString()) / 2)
      ).toFixed(2);
      // req.body.orderItemDetails[i].priceWithoutGst = (priceWithoutGst).toFixed(2)
    }
    req.body.sum = sum.toFixed(2);
    req.body.cgst9 = ((sum / 100) * 9).toFixed(2);
    req.body.sgst9 = ((sum / 100) * 9).toFixed(2);
    req.body.priceWithoutGst = priceWithoutGst.toFixed(2);
    let orderSummary = await OrderSummary.create(req.body);

    if (orderSummary) {
      await CartItem.deleteMany({});
    }

    await InvoiceNumber.deleteMany({});
    await InvoiceNumber.create({
      previousInvoiceNumber: invoiceNumber.previousInvoiceNumber + 1,
    });

    return res.json({ id: invoiceId });
  } catch (err) {
    console.log(err);
    return res.json({ status: "failure" });
  }
};
