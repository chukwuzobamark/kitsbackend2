const jwt = require('jsonwebtoken')
const User = require('../schema/userSchema')

const adminmiddleware = async (req, res,  next) => {

    const token = req.cookies.token
    const jwtsecret = process.env.JWT_SECRET
   if (!token) {
     return res.status(401).json({mess:'Please login or register to continue'})
   }
  
    try {
        const verifiedToken = jwt.verify(token, jwtsecret)
        if (!verifiedToken) {
             return res.status(401).json({mess:'Secret Invalid'})
        }

        const user = await User.findById({_id: verifiedToken.id}).select("-password")
        if (!user && !user.addCategoryadmin || user.Suparadmin) {
            return res.status(401).json({mess:'Invalid Id'})
        }    
        
     req.user = user
     next()
    } catch (error) {
        
    }
} 


module.exports = adminmiddleware
