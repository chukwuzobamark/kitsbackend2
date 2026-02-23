const express = require('express')
const {createProduct, getAllProducts, getProductById, deleteProduct, updateProduct, } = require('../controllers/productControllers')
const authMiddleware = require('../middlewares/authmiddleware')
const productRouter = express.Router()


// create a product
productRouter
    .post('/product', authMiddleware, createProduct)

//get all products
    .get('/allProducts', getAllProducts)

//get a single product
    .get('/product/:id', getProductById)

//update a product 
    .put('/product/:id', authMiddleware, updateProduct)

// delete a product
   .delete('/product/:id', authMiddleware, deleteProduct)



module.exports = productRouter