const { generateToken, sendMail } = require("../lib/sendMail")
const User = require("../schema/userSchema")


const otpVery = async (req, res) => {
    const { otp, email } = req.body
    
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({mess: 'User not found'})
        if (user.verified) return res.status(400).json({mess: 'User already verified'})
        if (user.otp && user.otp !== otp) return res.status(400).json({mess: 'OTP invalid'})
        if (user.otpInvalid < Date.now()) return res.status(400).json({ mess: 'OTP has epireed ' })
        
        user.otp = undefined
        user.otpInvalid = undefined
        user.verified = true

        await user.save()

          try {
                const mailObj = {
                  mailFrom: `Kits global ${process.env.KITS_EMAIL}`,
                  mailTo: email,
                  subject: 'Kits OTP Verification',
                  body: `
                      <h1> Welcome to Kits global, <strong> ${username}</strong>❤</hi>
                      <p> Here is your OTO ${otp} resent, proceed to verify</p>
                      <p>Please do not reply this mail, as it is coming from the app</p>
                  `
                }
                
                 sendMail(mailObj)
               
              } catch (error) {
                
              }
        res.status(200).json({mess:'Your account has nbeen verified, proceed to login'})
        
    } catch (error) {
        console.log(error)
    }
}


const otpResend = async (req, res) => {
    const { email } = req.body
    const time = Date.now()
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ mess: 'User not found' })
        if (user.verified) return res.status(400).json({ mess: 'User already verified' })
        if (time - user.lastOtpSent < 60 * 1000 ) return res.status(400).json({ mess: 'please wait for 20mins more' })
        
        
         const {otp, otpInvalid } = generateToken()
      
        user.otp = otp
        user.otpInvalid = otpInvalid
        user.lastOtpSent = time
        await user.save()

         try {
                const mailObj = {
                  mailFrom: `Kits global ${process.env.KITS_EMAIL}`,
                  mailTo: email,
                  subject: 'Otp resend',
                  body: `
                     
                      <p> This is the otp resend ${otp}</p>
                      
                  `
                }
                
                 sendMail(mailObj)
               
              } catch (error) {
                
              }
        res.status(200).json({mess:'Please check your email'})
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    otpVery,
    otpResend
}