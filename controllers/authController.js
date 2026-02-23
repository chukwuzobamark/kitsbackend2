const User = require("../schema/userSchema")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateToken, sendMail } = require("../lib/sendMail")

//login
const Signin = async (req, res) => {
  try {
      const { email, password } = req.body
      if (!email || !password) {
          res.status(400).json({ mess: 'Please provide all fields to continue' })
          return
      } else {
          const user = await User.findOne({ email })
      if (!user) {
        res.status(404).json({ mess: 'User not found, please proceed to register first or check the email well' })
        return 
          }
          if (!user.verified) return res.status(400).json({ mess: 'User need to verify first to login' })
          
          const comparedPassword = await bcrypt.compare(password, user.password)
          if (!comparedPassword) {
             res.status(404).json({ mess: 'Email, or password is incorrect. Please try again.' })
             return 
          }

          const getToken = (id) => {
              return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "30m"} )
          }

          const token = getToken(user._id)

          return res
              .cookie('token', token, {httpOnly: true, sameSite:'strict'})
              .status(200)
              .json({mess: "Login successful"})          
      }
  } catch (error) {
      res.status(500).json(({
        nessage: error.message
    }))
  }
}


//request for password reset

const resetRequest = async (req, res) => {
    const { email } = req.body
    
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ mess: 'account not found. please contact support or try again.' })
        const { passwordResetToken, otpInvalid } = generateToken()
        user.passwordResetToken = passwordResetToken
        user.passwordResetInValid = otpInvalid
        await user.save()

        //try to send otp to the email address
          try {
        const mailObj = {
          mailFrom: `Kits global ${process.env.KITS_EMAIL}`,
          mailTo: email,
          subject: 'Kits Password Reset',
          body: `
              <h1> You have requested for change of password, <strong> ${user.name}</strong>❤</hi>
              <p>https://student.axia.africa/${passwordResetToken}forgot-password</p>
          `
        }
        
         sendMail(mailObj)
       
      } catch (error) {
        console.log(error)
      }
                
   res.status(200).json({mess:"OTP sent"})
    } catch (error) {
        console.log(error)
    }
          
    
}

const validationpasswordOTP = async (req, res) => {
    const { token, email } = req.body 

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ mess: 'account not found. please contact support or try again.' })
        if (user.passwordResetToken !== token && user.passwordResetInValid < Date.now()) return res.status(400).json({ mess: 'OTP has epireed ' })
        res.status(200).json({ mess: 'Access granted to change password' })
    } catch (error) {
        console.log(error)
    }
}
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body 

    try {
        const user = await User.findOne({ passwordResetToken:token })
        if (!user) return res.status(400).json({ mess: 'account not found. please contact support or try again.' })
       
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        await user.save()
        
        res.status(200).json({ mess: 'password changed' })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    Signin,
    resetRequest,
    resetPassword,
    validationpasswordOTP
}