const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, 'Please provide a name'],
        minLength:3,
        maxLength:50,
        trim: true
    },
    email : {
        type:String,
        required:[true, 'Please provide email address'],
        trim: true,
        lowercase: true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please provide valid email.'],
        unique: true
    },
    password: {
        type:String,
        required:[true, 'Please provide password'],
        minLength:4
    }
})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


//This schema method is for creating a function to generate token for the user when he/she finish registering and send back to the client side

userSchema.methods.createJwT = function () {
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME,})
}

// This Schema method is created to compare password so as to allow login of candidate
userSchema.methods.comparePassword = async function (candidatePassword) {
const isMatch = await bcrypt.compare(candidatePassword, this.password)
return isMatch
}

module.exports = mongoose.model('User', userSchema)