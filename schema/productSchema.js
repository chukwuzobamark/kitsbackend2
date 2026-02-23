const mongoose = require("mongoose")


const ProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
         required: true
    },
    imgUrl: {
        type: String
    },
    size: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
},  {timestamps: true})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product


