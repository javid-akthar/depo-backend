const mongoose = require('mongoose');

const orderSummarySchema = new mongoose.Schema(
    {
        orderItemDetails :{
            type : [{ 
                productId : {
                    type: mongoose.Schema.Types.ObjectId,
                    ref : 'Products'
                },
                quantity : {
                    type: Number,
                    required : true
                  },
                price : {
                    type: mongoose.Types.Decimal128
                },
                cgstPer :{
                    type: String
                },
                cgstAmt : {
                    type : String
                },
                sgstPer :{
                    type: String
                },
                sgstAmt : {
                    type : String
                },
                priceWithoutGst : {
                    type: String
                }  
            }]
        },
        billingAddress : {
            name : {
                type : String
            },
            flatNoOrBuildingName : {
                type: String
            },
            locality : {
                type: String
            },
            city : {
                type: String
            },
            state : {
                type : String
            },
            pincode : {
                type : Number
            },
            gstin :{
                type: String
            }
        },
        shippingAddress : {
            name : {
                type : String
            },
            flatNoOrBuildingName : {
                type: String
            },
            locality : {
                type: String
            },
            city : {
                type: String
            },
            state : {
                type : String
            },
            pincode : {
                type : Number
            },
            gstin :{
                type: String
            }
        },
        invoiceId :{
            type: String,
        },
        sum :{
            type: mongoose.Types.Decimal128
        },
        cgst9 : {
            type: mongoose.Types.Decimal128
        },
        sgst9 : {
            type: mongoose.Types.Decimal128
        },
        priceWithoutGst: {
            type: mongoose.Types.Decimal128 
        }


    },
    {
        timestamps : true,
    }
);

const OrderSummary = mongoose.model('OrderSummary', orderSummarySchema);
module.exports = OrderSummary;