const express = require('express')
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userControllers')
const authMiddleware = require('../middlewares/authmiddleware')
const userRouter = express.Router()


const midd = (req, res, next) => {
    console.log('Checking if you have made payment')
    
    next()
}
// create a user
userRouter
    .post('/register', createUser)

//get all users
    .get('/allusers', getAllUsers)

//get a single user
    .get('/user/:id', getUserById)

//update a user
    .put('/user/:id',authMiddleware,midd,updateUser)

// delete a user
   .delete('/user/:id',authMiddleware, deleteUser)




module.exports = userRouter