require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {      
            token = req.headers.authorization.split(' ')[1]

            if(!token) {
                res.status(401).json({ msg: 'Not authorized. No token' })
            }
        
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')

            next()       
     } catch (err) {
        console.error(err)
        res.status(401).json({ msg: 'Not authorized. Token failed' })       
    }     
    }  
     
}

module.exports = { protect }