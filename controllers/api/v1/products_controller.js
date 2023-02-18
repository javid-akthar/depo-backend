const mongoose = require('mongoose');
const Products = require('../../../models/products');
const productsData = require('../../../product_data');

module.exports.getProducts =async function(req, res){
    try{
        let productsDataInDB = await Products.find({});
        let obj = {};
        for(let i=0; i<productsDataInDB.length; i++){
            let prop = productsDataInDB[i]._id.toString();
            obj[prop] = productsDataInDB[i]
        }
        return res.json(obj);
    }catch(err){
        console.log(err);

    }
}

module.exports.addProducts =async function(req, res){

    try{
        await Products.deleteMany({});
    let product = await Products.create(productsData);
    return res.json(product);
    }catch(err){
        return res.json({status: "failure"});
    }
    
}