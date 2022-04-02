const cloudinary = require('cloudinary');
const crypto = require('crypto');
const User = require('../models/user');

const BigPromise = require('../middlewares/bigPromise');

const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const mailHelper = require('../utils/mailHelper');

exports.signup = BigPromise(async(req, res, next)=>{

    if(!req.files){
        return next(new CustomError("photo is required for signup", 400));
    }

    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return next(new CustomError("Name email and password is required", 400));
    }
    
    let file = req.files.photo;

    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: 'users',
        width: 150,
        crop: 'scale'
    });

    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    });

  cookieToken(user,res);
});

exports.login = BigPromise(async(req, res, next)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return next(new CustomError('Please enter email and password both', 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new CustomError('This email is not registered to us ',400));
    }

    const isPasswordCorrect = await user.isPasswordValidated(password);

    if(!isPasswordCorrect){
        return next(new CustomError('Password and email is not matching ', 400));
    }

    //send token to user
    cookieToken(user, res);

});

exports.logout = BigPromise(async(req,res, next)=>{
    res.cookie('token', null,{
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "User Successfully logged out"
    });
});

exports.forgotPassword = BigPromise(async(req, res, next)=>{
    const {email} = req.body;
    
    const user = await User.findOne({email});

    if(!user){
        return next(new CustomError('This user does not exist in our database', 403));
    }

    const forgotToken = user.getForgotPasswordToken()

    await user.save({validateBeforeSave: false})


    const myUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${forgotToken}`;

    const message = `copy paste this link in your search bar and hot enter \n\n ${myUrl}`;

    try{
        await mailHelper({
            email: user.email,
            subject: "Email for password Reset",
            message
        })

        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });

    }catch(error){
        user.forgotPasswordToken = undefined
        user.forgotPasswordTokenExpiry = undefined

        await user.save({validateBeforeSave: false})
        return next(new CustomError(error.message, 500))

    }
});

exports.resetPassword = BigPromise(async(req, res, next)=>{
    const token = req.params.token;

    const encryptToken = crypto.createHash('sha256').update(token).digest('hex');

    const user =  await User.findOne({
        encryptToken,
        forgotPasswordTokenExpiry: {$gt: Date.now()}
    });

    if(!user){
        return next(new CustomError('Token is invalid or expired', 403));
    }

    const {password, confirmPassword}= req.body;
    
    if(password != confirmPassword){
        return next(new CustomError('both the password fields are not matching', 400));
    }
    
    user.password = password;

    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

exports.changePassword = BigPromise(async (req, res, next)=>{
    const userId = req.user.id;

    const user = await User.findById(userId).select("+password");

    const isOldPasswordCorrect = await user.isPasswordValidated(req.body.oldPassword);

    if(!isOldPasswordCorrect){
        return next(new CustomError('Old password is not correct', 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    cookieToken(user, res);
});
