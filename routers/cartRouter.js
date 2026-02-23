const express = require('express')

const authMiddleware = require('../middlewares/authmiddleware')
const { creatCart, deleteCartItem,deleteAllCartItems, getCartItems, editCartItems } = require('../controllers/cartController')
const cartRouter = express.Router()


// create a cart
cartRouter
    .post('/creatCart/:productId', authMiddleware, creatCart)

//get cart
    .get('/cart',authMiddleware, getCartItems)

//edit cart
    .put('/cart/:id',authMiddleware, editCartItems)

//delete cart
    .delete('/cartItem/:productId',authMiddleware, deleteCartItem)
    .delete('/cartItem',authMiddleware, deleteAllCartItems)




module.exports = cartRouter