const express = require('express')
const {otpResend, otpVery} = require('../controllers/otpVeryController')

const otpVeryRouter = express.Router()


// create a user
otpVeryRouter
    .post('/verify', otpVery)
    .post('/resendOTP', otpResend)





module.exports = otpVeryRouter