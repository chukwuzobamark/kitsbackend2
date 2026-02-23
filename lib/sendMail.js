const nodemailer = require('nodemailer')
const Crypto = require('crypto')

 const generateToken = () => {
    return {
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        otpInvalid: new Date(Date.now() + 20 * 60 * 1000),
        passwordResetToken: Crypto.randomBytes(32).toString('hex')
        
    }
}

 const sendMail = async ({mailFrom, mailTo, subject, body}) => {
    try {
         //verify the  our app
        const transporter = nodemailer.createTransport({
             host: process.env.EMAIL_HOST,
             port: process.env.EMAIL_POST,
             secure: true,
             auth: {
                 user: process.env.KITS_EMAIL,
                 pass: process.env.EMAIL_PASS
            }
        })
         
        // now send the email
       await transporter.sendMail({
            from: mailFrom,
            to: mailTo,
            subject,
            html: body
       })
        // return info
        
     } catch (error) {
        console.log(error.message)
     }
  
}

module.exports = {
    sendMail,
    generateToken
}


