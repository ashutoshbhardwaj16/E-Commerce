const express = require('express')
const app = express();
const morgan = require('morgan')
const mongoose = require('mongoose'); 
const cors = require('cors');
 // require('dotenv').config({path: './.env'})
// require('dotenv/config') testing commit success
const api2 = process.env.API_URL;

app.use(cors());
app.options('*', cors());
// MiddleWare
app.use(express.json())
app.use(morgan('tiny'))

// Routes
const categoriesRoutes = require('./routers/categories');
const productsRouter = require('./routers/products');
const usersRoutes = require('./routers/users');
const ordersRoutes = require('./routers/orders');


const api = 'api/v1';

app.use(`/${api}/products`, productsRouter);
app.use(`/${api}/categories`, categoriesRoutes);
app.use(`/${api}/users`, usersRoutes);
app.use(`/${api}/orders`, ordersRoutes);


/* connecting db */
// const CONNECTION_STRING = 'mongodb+srv://ashu:qwEsc342@cluster0.hysqv.mongodb.net/?retryWrites=true&w=majority';
const CONNECTION_STRING = 'mongodb+srv://ashu:qwEsc342@cluster0.zmur1.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology:  true,
    dbName: 'eshop-dataBase'
})
.then(()=>{
    console.log('connected to mongoose')
})
.catch((err)=>{
    console.log('the eroror while connecting to mongoose', err);
})

app.listen(3000,()=>{
    console.log('hello world running at localhost: 3000');
} )