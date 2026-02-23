const express = require('express')
const productRouter = require('./routers/productRouter')
const userRouter = require('./routers/userRouter')
const connectDB = require('./mongoDb/dbconnection')
const authRouter = require('./routers/authRouter')
const otpVeryRouter = require('./routers/otpVeryRouter')
const cookieParser = require('cookie-parser')
const cartRouter = require('./routers/cartRouter')
const categoryRouter = require('./routers/categoryRouter')

require('dotenv').config()


connectDB()

const port = process.env.PORT || 4000
const server = express()

//middlewares
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(cookieParser())

//Routers
server.use('/api', productRouter)
server.use('/api', userRouter)
server.use('/api', authRouter)
server.use('/api', otpVeryRouter)
server.use('/api', cartRouter)
server.use('/api', categoryRouter)

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})