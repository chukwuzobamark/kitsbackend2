const { generateToken, sendMail } = require("../lib/sendMail")
const User = require("../schema/userSchema")
const bcrypt = require('bcrypt')


//Get users

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    if (users.length === 0) return res.status(200).json({mess: 'No users(s) found, proceed to register'})
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({mess: error.message})
  }
}

//get A user by Id

const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) return  res.status(400).json({ mess: `user with the id ${id} not found!` }) 
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({mess: error.message})
  }
}

// CREATE a user
const createUser = async (req, res) => {
  try {
    const { username, email, password, } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({mess: 'All fields are required'})
    } else {
      let user = await User.findOne({ email })
      if (user) {
        res.status(404).json({ mess: 'User already registered please proceed to login' })
        return 
      }
      let hashedPassword = await bcrypt.hash(password, 10)

      // generate otp
      
      const {otp, otpInvalid } = generateToken()
      const time = Date.now()


         const newUser = new User(
        {
          ...req.body,
          password: hashedPassword,
          otp,
          otpInvalid,
          lastOtpSent: time
        })
      await newUser.save()
  
      try {
        const mailObj = {
          mailFrom: `Kits global ${process.env.KITS_EMAIL}`,
          mailTo: email,
          subject: 'Kits OTP Verification',
          body: `
              <h1> Welcome to Kits global, <strong> ${username}</strong>❤</hi>
              <p> Here is your OTO ${otp}, proceed to verify</p>
              <p>Please do not reply this mail, as it is coming from the app</p>
          `
        }
        
         sendMail(mailObj)
       
      } catch (error) {
        res.status(500).json({mess:'internal server error'})
      }
      res.status(200).json(newUser)
    }

  } catch (error) {
      console.log(error)
  }
}




//delete user

const deleteUser = async (req, res) => {
  try {
    const { user } = req.user 
    const { id } = req.params
    if (id === user._id || user.superAdmin || user.addCategoryadmin) {
    const user = await User.findByIdAndDelete(id)
       if (!user) return  res.status(400).json({ mess: `user with the id ${id} not found!` }) 
      res.status(200).json(user)
      } else {
 return  res.status(400).json({ mess: `Account doesnt belong to you` }) 
}
  } catch (error) {
     res.status(500).json({mess: error.message})
  }
}

//update user
const updateUser = async (req, res) => {
  const { user } = req.user 
   const { name, gmail, gender,  } = req.body
    const { id } = req.params
if (id === user._id) {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, gmail, gender },
      {new: true}
    )
     if (!user) return  res.status(400).json({ mess: `user with the id ${id} not found!` }) 
    res.status(200).json(user)
  } catch (error) {
    
  } 
} else {
 return  res.status(400).json({ mess: `Account doesnt belong to you` }) 
}
}
module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  deleteUser,
  updateUser
}
