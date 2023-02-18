const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    dsin :{
        type : String,
    },
    system_listing_name : {
        type : String,
    },
    mrp : {
        type: mongoose.Types.Decimal128
    },
    hsn_code : {
        type: String
    },
    gst_slab : {
        type: mongoose.Types.Decimal128
    },
    unit : {
        type: String
    }
   

},{
    timestamps : true
});

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;