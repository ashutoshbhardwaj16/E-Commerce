const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
// const Product = require('../models/product'); // when product model is exported as -> module.exports = Product 
const {Product} = require('../models/product');

const mongoose = require('mongoose');

/* get all products */
router.get(`/`,async (req, res)=>{
    //   const productList = await Product.find().select('name image -_id')    -> get all product's name and image without id
    /* qurey parameter is when we give in /product?categories=1231231,123123 */
    let filter = {}
    if (req.query.category){
        filter = {category: req.query.categories.split(',')}  
    } // when categories is there -> It will filter otherwise will give all products
    const productList = await Product.find(filter)
    if (!productList){
        res.status(500).json({success: false});
    }
     res.send(productList);
})

/* get specific product */
router.get(`/:id`,async (req, res)=>{
     // const productList = await Product.findById(req.params.id).populate('category')  -> give product category along with product
    const product = await Product.findById(req.params.id)
    if (!product){
        res.status(500).json({success: false});
    }
     res.send(product);
})



// /${api}/products
router.post(`/`, async (req, res)=>{
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).json({status: false, message:'Invalid Category'});
    const productObj = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price : req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    }
       // name: req.body.name,
);
    const product = await productObj.save();
    if (!product){
        return res.status(500).json({status: false ,message: 'Product cannot be created'});
    }
 res.send(product);
    // product.save().then((createdProduct)=>{
    //     res.status(201).json(createdProduct)
    // }).catch((err)=>{
    //     console.log(err, 'error from cathc')
    //     res.status(500).json({
    //         error: err,
    //         sucess: false
    //     })
    // })
    // res.send(product);
    // res.send('wlecome to api')
})

/* product edit/put */

router.put('/:id', async (req, res)=>{
    if (!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).json({ status: false, message: 'Invalid Product Id'})
    }
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).json({status: false, message:'Invalid Category'});
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price : req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    }, {
        new: true
    });
    if (!product){
        return res.status(500).json({success: false, message: 'product id not found'})
    }
  //  res.status(200).send(product);
    res.send(product);
})

router.delete('/:id', (req, res)=>{
    Product.findByIdAndDelete(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success: true, message: 'The Selected product is deleted'});
        } else{
            return res.status(404).json({success: false, message: 'No product found'});
        }
    }).catch((err)=>{
        return res.status(400).json({ success: false, error:err});
    })
})

/* get products count API */
router.get(`/get/count`,async (req, res)=>{
   const productCount = await Product.countDocuments()
   if (!productCount){
       return res.status(500).json({success: false});
   }
    res.send({productCount: productCount});
})

/* get featured products  */
router.get(`/get/featured/:count`,async (req, res)=>{
    const count = req.params.count ? req.params.count :  0;
    const products = await Product.find({isFeatured: true}).limit(+count);
   if (!products){
       return res.status(500).json({success: false});
   }
    res.send({products: products});
})

module.exports=  router;    