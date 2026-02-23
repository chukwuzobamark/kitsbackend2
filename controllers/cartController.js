const Cart = require("../schema/cartSchema")
const Product = require("../schema/productSchema")


const creatCart = async (req, res) => {

    const { productId } = req.param
    const { user } = req.user 

  try {
      const product = await Product.findById(id)
      if (!product) return res.status(400).json({mess:'Product not in db'})
      let usersCart = await Cart.findOne({ userId: user._id })
      if (!usersCart) {
          usersCart = new Cart({
              userId: user._id,
              products: [
                  {
                      productId: productId,
                      quantity: 1,
                      price: product.price
                  }
              ]  
        })
      } else {
          const Itemincart = Cart.products.find(item => item.productId.toString() === productId)
          if (Itemincart) {
            Itemincart.quantity += 1
          } else {
              Cart.products.push({
                   productId: productId,
                      quantity: 1,
                      price: product.price
              })
          }
      }
//update the total of each item 
      Cart.products.forEach(item => {
          item.totalItemPrice = item.price * item.quantity
      })
      //update the cats total
      let totalCartItemPrice = Cart.products.reduce((accumulator, currentItem) => accumulator + currentItem.totalItemPrice, 0)
      Cart.totalCartItemPrice = totalCartItemPrice

      //save cart
      await Cart.save()
      res.status(200).json({mess:' Product added successfully'})
  } catch (error) {
     res.status(500).json({mess: error.message})
  }
}

const getCartItems = async (req, res) => {
    const { user } = req.user 
    try {
        const cartItems = await Cart.findOne({ userId: user._id }).populate('products.productId', '-userId -color -size')
      

        if (!cartItems) return res.status(400).json({ mess: 'No Items added yet' })
        res.status(200).json(cartItems)
    } catch (error) {
        console.log(error)
    }
    
}
const deleteCartItem = async (req, res) => {
    const { productId } = req.param
     const { user } = req.user 

    try {
        const cart = await Cart.findOne({
            userId: user._id,
        
        })
        if (!cart) return res.status(400).json({ mess: 'Your cart is empty! Browse our categories and discover our best deals!' })
        const deleted = cart.products.findByIdAndDelete(productId)
        if (deleted) return res.status(200).json({mess:'Product was removed from the cart'})
    } catch (error) {
        console.log(error)
    }
    
}

const deleteAllCartItems = async (req, res) => {

     const { user } = req.user 
    try {
        const cart = await Cart.findOne({ userId: user._id })
        if (!cart) return res.status(400).json({ mess: 'Your cart is empty! Browse our categories and discover our best deals!' })
        cart.products = []
        cart.totalCartItemPrice = 0
        
        
            await cart.save()
        
        res.status(200).json({mess: 'All cart Items removed'})
    } catch (error) {
        console.log(error)
    }
    
}

const editCartItems = async (req, res) => {
    const { user } = req.user 
    const { productId, type } = req.body 
    if (!productId || !type) return res.status(400).json({ mess: 'Please provide all fields' })
    try {
         const cart = await Cart.findOne({ userId: user._id })
        if (!cart) return res.status(400).json({ mess: 'Your cart is empty! Browse our categories and discover our best deals!' })
        const itemIncart = cart.products.find(item => item.productId.toString() === productId)
        if (type === 'increase') {
            itemIncart.quantity += 1
        } else if (type === 'decrease' && itemIncart.quantity > 1){
            itemIncart.quantity -= 1
        } else {
            res.status(400).json({mess:'Type can only be increase or decrease'})
        }
        //update the total of each item 
      cart.products.forEach(item => {
          item.totalItemPrice = item.price * item.quantity
      })
      //update the cats total
      let totalCartItemPrice = cart.products.reduce((accumulator, currentItem) => accumulator + currentItem.totalItemPrice, 0)
      cart.totalCartItemPrice = totalCartItemPrice

      //save cart
      await cart.save()
      res.status(200).json({mess:' Product Updated successfully'})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    creatCart,
    deleteCartItem,
    deleteAllCartItems,
    getCartItems,
    editCartItems
}