const mongoose = require("mongoose");
const InvoiceNumber = require("../../../models/invoiceNumber");
const OrderSummary = require("../../../models/orderSummary");
const pdf = require("pdf-creator-node");
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
    console.log('orderSummarydata',orderSummary.createdAt);
    let enterDate = orderSummary.createdAt
    let date = new Date(enterDate);  
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    let orderDate = day + "/" + month +"/" + year;
    console.log(month+"/"+day+"/"+year)
    let filename = null;
  try {
    let html = fs.readFileSync(
      path.join(__dirname + "../../../../invoice.html"),
      "utf8"
    );
    let output = Date.now() + "output.pdf";
    var options = {
      format: "Letter",
      orientation: "portrait",
      border: "10mm",
      header: {
        height: "10mm",
      },
      footer: {
        height: "28mm",
        contents: {
          first: "Cover page",
          2: "Second page", 
          default:
            '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', 
          last: "Last Page",
        },
      }
      ,
      childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
      }
    };
    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
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
        orderDate : orderDate
      },
      path: "./uploads/" + output ,
      type: "",
    };

    // var files = fs.readdirSync(path.join(__dirname, '../../../uploads'));
    // if (files.length > 0)
    //   for (file of files) {
    //     var filePath = path.join(__dirname, '../../../uploads', file);
    //     if (fs.statSync(filePath).isFile())
    //       fs.unlinkSync(filePath);
    //   }
    pdf.create(document, options)
      .then((response) => {
        console.log("response",response)
        let filename = response.filename;
        console.log('filename2',filename)
        return res.sendFile(response.filename);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
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
    console.log(response.filename); 

    res.download(response.filename, () => {});
  });
}

function  pdfCreation(orderSummary) {
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
          first: "",
          2: "Second page", 
          default:
            '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
          last: "",
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
        console.log("response",res)
        let filename = res.filename;
        return filename;
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
}
