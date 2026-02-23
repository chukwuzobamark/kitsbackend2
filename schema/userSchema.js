const mongoose = require("mongoose")


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Suparadmin: {
        type: Boolean,
        default: false
    },
    addCategoryadmin: {
        type: Boolean,
        default: true
    },
    messageAdmin: {
        type: Boolean,
        default: false
    },
    profile: {
        country: String,
        Street: String,
        Bio: String
    },
    otp: String,
    otpInvalid: Date,
    lastOtpSent: Date,
    passwordResetToken: String,
    passwordResetInValid: Date,
    verified: {
        type: Boolean, default: false
    }

}, {timestamps: true})

const User = mongoose.model('User', UserSchema)

module.exports = User

