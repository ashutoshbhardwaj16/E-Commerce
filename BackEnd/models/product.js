const mongoose = require('mongoose'); 

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
})

// module.exports =  mongoose.model('Product', productSchema);;

exports.Product = mongoose.model('Product', productSchema);
