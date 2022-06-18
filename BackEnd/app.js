const express = require('express')
const app = express();
const morgan = require('morgan')
const mongoose = require('mongoose'); 
 // require('dotenv').config({path: './.env'})
// require('dotenv/config')
const api2 = process.env.API_URL;
const api = 'api/v1';
console.log(api2)
// MiddleWare
app.use(express.json())
app.use(morgan('tiny'))

app.get(`/${api}/products/all`,async (req, res)=>{
    const productList = await Product.find()
    if (!productList){
        res.status(500).json({success: false});
    }
     res.send(productList);
})

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
})

const Product = mongoose.model('Product', productSchema);

app.post(`/${api}/products`, (req, res)=>{
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



const CONNECTION_STRING = 'mongodb+srv://ashu:qwEsc342@cluster0.hysqv.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology:  true,
    dbName: 'eshop-dataBase'
})
.then(()=>{
    console.log('connected to mongoose')
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000,()=>{
    console.log('hello world running at localhost: 3000');
} )