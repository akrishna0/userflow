const cloudinary = require('cloudinary');

const User = require('../models/user');

const BigPromise = require('../middlewares/bigPromise');

const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');

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
})

