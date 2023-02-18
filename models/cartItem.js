const mongoose = require('mongoose');

const cartItemsSchema = new mongoose.Schema(
    {
      productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Products',
        unique: true
      },
      quantity : {
        type: Number,
        required : true
      }
    },
    {
        timestamps : true,
    }
)

const CartItem = mongoose.model('CartItem',cartItemsSchema);
module.exports = CartItem;