const Category = require("../schema/category")


const categoryController = async (req, res) => {
    try {
        
        const { name } = req.body
        if (!name) return res.status(400).json({ mess: "Name can't be empty" })
        const category = await Category.findOne({name})
        if (category) return res.status(400).json({ mess: `The category is already in the Db` })
        
        const newcategory = new Category({ name })
        await newcategory.save()
        
        res.status(201).json({mess:'category added'})
    } catch (error) {
        res.status(500).json({ mess: error.message })
    }
}
const getcategories = async (req, res) => {
    try {

        const categories = await Category.find()
        if (!categories) return res.status(400).json({ mess: `none so far` })
        
        res.status(201).json(categories)
    } catch (error) {
        res.status(500).json({ mess: error.message })
    }
}




module.exports = {
    categoryController,
    getcategories
}