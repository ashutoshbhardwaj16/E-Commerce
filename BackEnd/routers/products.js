const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
// const Product = require('../models/product'); // when product model is exported as -> module.exports = Product 
const {Product} = require('../models/product');

/* get all products */
router.get(`/`,async (req, res)=>{
    //   const productList = await Product.find().select('name image -_id')    -> get all product's name and image without id
    const productList = await Product.find()
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
        res.status(500).json({success: false, message: 'product id not found'})
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

module.exports=  router;    