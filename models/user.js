const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

//encrypting Password
userSchema.pre('save', async function(next){
    //this is to handle encryption when the password is modified like only when creating and forgot password
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

//validating the password
userSchema.methods.isPasswordValidated = async function(sentPassword){
//isPasswordValidated can be named anything it's the name of the method created to handle validation
    return await bcrypt.compare(sentPassword, this.password)
}

//creating jwt token
userSchema.methods.getJWTToken = function(){
    return jwt.sign(
        {id: this._id, email: this.email},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRY}
    );
}

module.exports = mongoose.model('User', userSchema);