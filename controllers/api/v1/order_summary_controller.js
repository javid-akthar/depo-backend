const mongoose = require("mongoose");
const InvoiceNumber = require("../../../models/invoiceNumber");
const OrderSummary = require("../../../models/OrderSummary");
const pdf = require("pdf-creator-node");
// const pdf = require('html-pdf')
const fs = require("fs");
const path = require("path");
const { ToWords } = require("to-words");
const toWords = new ToWords();

module.exports.getAllInvoice = async function (req, res) {
  try {
    let orderSummary = await OrderSummary.find({});
    let invoiceArray = [];
    for (let i = 0; i < orderSummary.length; i++) {
      invoiceArray.push(orderSummary[i].invoiceId);
    }
    invoiceArray.reverse();
    return res.json(invoiceArray);
  } catch (err) {
    console.log(err);
    return res.json({ status: "failure" });
  }
};
module.exports.setInvoiceNumber = async function (req, res) {
  try {
    await InvoiceNumber.deleteMany({});
    await InvoiceNumber.create(req.body);
    return res.json({ status: "success" });
  } catch (err) {
    console.log(err);
    return res.json({ status: "failure" });
  }
};

module.exports.invoiceGenerator = async function (req, res) {
  try {
    console.log("req.body", req.body);
    let orderSummary = await OrderSummary.findOne(req.body).populate({
      path: "orderItemDetails",
      populate: { path: "productId" },
    });
    orderSummary = orderSummary.toJSON();
    let filename = null;
  try {
    let html = fs.readFileSync(
      path.join(__dirname + "../../../../invoice.html"),
      "utf8"
    );
    let output = Date.now() + "output.pdf";
    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
      header: {
        height: "10mm",
      },
      footer: {
        height: "28mm",
        contents: {
          first: "Cover page",
          2: "Second page", // Any page number is working. 1-based index
          default:
            '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: "Last Page",
        },
      },
    };
    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
          // can be used to override defaults for the selected locale
          name: "Rupee",
          plural: "Rupees",
          symbol: "₹",
          fractionalUnit: {
            name: "Paisa",
            plural: "Paise",
            symbol: "",
          },
        },
      },
    });
    let words = toWords.convert(orderSummary.sum, { currency: true });
    for (let i = 0; i < orderSummary.orderItemDetails.length; i++) {
      orderSummary.orderItemDetails[i].index = i + 1;
    }
    orderSummary.sumInWords = words;

    var document = {
      html: html,
      data: {
        orderItemDetails: orderSummary.orderItemDetails,
        billingAddress: orderSummary.billingAddress,
        shippingAddress: orderSummary.shippingAddress,
        orderSummary: orderSummary,
      },
      path: "./output" + output + ".pdf",
      type: "",
    };

    pdf
      .create(document, options)
      .then((response) => {
        // console.log("res",res);
        console.log("response",response)
        let filename = response.filename;
        console.log('filename2',filename)
        // return filename;
        return res.sendFile(response.filename);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
  // return res.sendFile(filename);
    // let filename = await pdfCreation(orderSummary);
    // console.log('filename',filename);
    // return res.sendFile(filename);

    

    // return res.json({ status: "success" });
  } catch (err) {
    console.log(err);
    return res.json({ status: "failure" });
  }
};

function pdfCreation2(orderSummary) {
  let html = fs.readFileSync(
    path.join(__dirname + "../../../../invoice.html"),
    "utf8"
  );
  var options = { format: "Letter" };
  let output = Date.now() + "output.pdf";
  pdf.create(html, options).toFile(output, function (err, response) {
    if (err) return console.log(err);
    console.log(response.filename); // { filename: '/app/businesscard.pdf' }

    res.download(response.filename, () => {});
  });
}

function  pdfCreation(orderSummary) {
  // D:\depo24\depo24BackEnd\controllers\api\v1\order_summary_controller.js
  // D:\depo24\depo24BackEnd\invoice.html
  // Read HTML Template
  try {
    let html = fs.readFileSync(
      path.join(__dirname + "../../../../invoice.html"),
      "utf8"
    );
    // console.log(html);
    let output = Date.now() + "output.pdf";
    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
      header: {
        height: "10mm",
        // contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
      },
      footer: {
        height: "28mm",
        contents: {
          first: "Cover page",
          2: "Second page", // Any page number is working. 1-based index
          default:
            '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: "Last Page",
        },
      },
    };

    // var orderSummar = [];
    //  let orderItemDetails = JSON.parse(orderSummary.orderItemDetails);

    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
          // can be used to override defaults for the selected locale
          name: "Rupee",
          plural: "Rupees",
          symbol: "₹",
          fractionalUnit: {
            name: "Paisa",
            plural: "Paise",
            symbol: "",
          },
        },
      },
    });
    let words = toWords.convert(orderSummary.sum, { currency: true });
    for (let i = 0; i < orderSummary.orderItemDetails.length; i++) {
      orderSummary.orderItemDetails[i].index = i + 1;
    }
    orderSummary.sumInWords = words;

    var document = {
      html: html,
      data: {
        orderItemDetails: orderSummary.orderItemDetails,
        billingAddress: orderSummary.billingAddress,
        shippingAddress: orderSummary.shippingAddress,
        orderSummary: orderSummary,
      },
      path: "./output" + output + ".pdf",
      type: "",
    };

    pdf
      .create(document, options)
      .then((res) => {
        // console.log("res",res);
        console.log("response",res)
        let filename = res.filename;
        console.log('filename2',filename)
        return filename;
        // response.sendFile(res.filename);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
}
