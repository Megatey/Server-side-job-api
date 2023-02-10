const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')



const register = async (req, res) => {
    try {
        const user = await User.create({...req.body})
        const token = await user.createJwT()
        res.status(StatusCodes.CREATED).json({status: true, username: user.name, token})
    } catch (error) {
        console.log( 'something occured')
        if(error.code === 11000) {
        res.status(500).json({msg: 'Email Address already exist'})
        return
        }
        res.status(500).json({msg: 'Internal Error'})
    }
}


const login = async (req, res) => {
    const {email, password} = req.body
    try {
        if(!email || !password) {
            res.status(StatusCodes.BAD_REQUEST).json('Please Provide email and password')
            return;
        }
    
        const user = await User.findOne({email})
        if(!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({error: true, msg: 'Invalid Credentials'})
            return;
        }
        
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect) {
            res.status(StatusCodes.UNAUTHORIZED).json({error: true, msg: 'Invalid Credentials'})
            return;
        }
        const token = await user.createJwT()
        res.status(StatusCodes.OK).json({status: true, username: user.name, token})
    } catch (error) {
        res.status(500).json({msg: 'Internal Error'})
    }
    
}

module.exports = {register, login}