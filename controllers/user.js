const User = require('../models/user');
const BigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');


exports.signup = BigPromise(async(req, res, next)=>{
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return next(new CustomError("Name email and password is required", 400));
    }

    const user = User.create({
        name,
        email,
        password
    });

   cookieToken(user,res);
})

