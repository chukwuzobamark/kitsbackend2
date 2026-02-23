const express = require('express')
const {Signin, resetRequest, resetPassword} = require('../controllers/authController')
const authRouter = express.Router()


// authentication
authRouter
    .post('/user/Signin', Signin)
    .post('/password/resetRequest', resetRequest)
    .post('/password/reset', resetPassword)



module.exports = authRouter