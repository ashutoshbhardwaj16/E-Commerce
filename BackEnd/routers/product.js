const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get(`/`,async (req, res)=>{
    const productList = await Product.find()
    if (!productList){
        res.status(500).json({success: false});
    }
     res.send(productList);
})

// /${api}/products
router.post(`/`, (req, res)=>{
    const product =new Product({
        name: req.body.name,
        image:  req.body.image,
        countInStock: req.body.countInStock
    });

    product.save().then((createdProduct)=>{
        res.status(201).json(createdProduct)
    }).catch((err)=>{
        console.log(err, 'error from cathc')
        res.status(500).json({
            error: err,
            sucess: false
        })
    })
    // res.send(product);
    // res.send('wlecome to api')
})

module.exports=  router;