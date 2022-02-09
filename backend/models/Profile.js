const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    school: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    bootcamp: {
        type: String,
        required: true
    }  
},
{
    timestamps: true,
}
)

const Profile = mongoose.model('Profile', ProfileSchema)
module.exports = Profile