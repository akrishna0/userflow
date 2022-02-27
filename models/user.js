const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'This field is required please provide the name'],
        maxlength: [50, 'Name should be upto 50 chars only.']
    },
    email: {
        type: String,
        required: [true, 'email is mandatory field'],
        unique: true,

    },
    password:{
        type: String,
        required: [true, 'please provide the password'],
        minlength: [true, 'password can be of min 6 chars'],
    //select is to not send password everytime user is fetched 
        select: false
    },
    photo: {
        id:{
            type: String,
            required: true
        },
        secure_url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: 'user'
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }



})

module.exports = mongoose.model('User', userSchema);