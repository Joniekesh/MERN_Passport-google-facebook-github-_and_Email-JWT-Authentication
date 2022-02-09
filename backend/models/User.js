const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email : { 
            type: String, 
            index:true, 
            unique:true,
            sparse:true
        },
        avatar: {
            type: String,
            default: ''
        },
        password: {
            type: String
        },
        socialID: {
            type: String,
            default: ""
        },
        registrationType: {
            type: String,
            enum: ['email', 'google', 'facebook', 'github'],
            default: 'email'
        },
        
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)
UserSchema.pre('save', async function(next) {
   if(!this.isModified('password')) {
       next()
   } 

   const salt = await bcrypt.genSalt(10)
   this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', UserSchema)
module.exports = User
