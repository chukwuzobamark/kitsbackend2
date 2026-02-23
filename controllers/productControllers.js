const Product = require("../schema/productSchema")
const Category = require("../schema/category")



//Get products

const getAllProducts = async (req, res) => {
  try {
    const { size, color, name, category } = req.query


    const filter = {}

    if (query) {
      const foundcategory = await Category.findOne({ name: category })

      if (!foundcategory) return res.status(200).json({ mess: "Category not in db" })
      filter.category = foundcategory
    }

    if (size) filter.size = size
    if (color) filter.color = color
    if (name) filter.name = name

    const products = await Product.find(filter).populate("category")
    if (!products) {
      const products = await Product.find().populate("category")
      return res.status(200).json(products)
    }
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ mess: error.message })
  }
}


//get A product by Id

const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) return res.status(400).json({ mess: `product with the id ${id} not found!` })
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ mess: error.message })
  }
}
//CREATE a product
const createProduct = async (req, res) => {
  const { name, price, color, size, imgUrl, category } = req.body
  const { user } = req.user
  try {
    if (!name || !price || !color || !size || !category || !imgUrl) {
      return res.status(400).json({ message: "Please provide all fields" })
    }
    const foundcategory = await Category.findById(category)

    if (!foundcategory) {
      return res.status(400).json({ message: `iform the admin to add the category ${category}`})
    }

    const newProduct = new Product({ ...req.body, userId: user._id })
    await newProduct.save()
    res.status(201).json({ mess: 'Product added' })
  } catch (error) {
    res.status(500).json(error)
  }
}

//delete product

const deleteProduct = async (req, res) => {

  try {
    const { user } = req.user
    const { id } = req.params

    const product = await Product.findById(id)
    if (!product) return res.status(400).json({ mess: `product with the id ${id} not found!` })
    if (product.userId !== user._id) {
      return res.status(400).json({ mess: `You can only delete your product!` })
    }
    await product.deleteOne()
    res.status(200).json({ mess: 'Product deleted successfully' })

  } catch (error) {
    res.status(500).json({ mess: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { name, price, color } = req.body
    const { id } = req.params
    const { user } = req.user

    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, color },
      { new: true }
    )
    if (!product) return res.status(400).json({ mess: `product with the id ${id} not found!` })
    res.status(200).json(product)
  } catch (error) {

  }
}
module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
}
