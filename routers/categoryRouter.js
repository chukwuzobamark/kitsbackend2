const express = require('express')
const {categoryController, getcategories} = require('../controllers/categoryController')
const adminmiddleware = require('../middlewares/adminmiddleware')

const categoryRouter = express.Router()


// authentication
categoryRouter
    .post('/product/categoryRouter', adminmiddleware, categoryController)
    .get('/allcategories', getcategories)
   


module.exports = categoryRouter