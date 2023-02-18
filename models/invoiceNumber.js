const mongoose = require("mongoose");

const invoiceNumberSchema = new mongoose.Schema(
  {
    previousInvoiceNumber: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const InvoiceNumber = mongoose.model("InvoiceNumber", invoiceNumberSchema);
module.exports = InvoiceNumber;
