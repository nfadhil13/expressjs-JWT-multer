const User = require('../model/user');
const { validationResult } = require("express-validator")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


exports.signup = async (req , res ,next) => {
    const errors = validationResult(req);
    console.log('signup');
    try{
        if(!errors.isEmpty()){
            const error = new Error('Body input not right');
            error.statusCode = 422;
            error.cause = errors.array();
            throw error;
    
        }
        const email = req.body.email;
        const checkEmailExist = await User.findOne({
            where : {
                email : email
            }
        });
        if(checkEmailExist){
            const error = new Error('Exist credential');
            error.statusCode = 422;
            error.cause = "Account with such email is exist"
            throw error;
        }
        console.log("email is not exist");
        const name = req.body.name;
        const password = req.body.password;
        console.log(password);
        const hashedPassword = await bcrypt.hash(password , 12)
        console.log(hashedPassword)
        const newUser = await User.create({
            email : email,
            name : name,
            password : hashedPassword
        })
        console.log(newUser);
        res.status(201).json({
            message : "Success create user",
            userId  : newUser
        })
    
    }catch(err){
        next(err)
    }

}
 
exports.login = async (req , res ,next ) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({
            where : {
                email : email
            }
        });
        if(!user){
            const error = new Error('Invalid credential');
            error.statusCode = 401;
            error.cause = "Account with such email is not exist"
            throw error;
        }
    
        const password = req.body.password;
        const isPasswordValid = await bcrypt.compare(password , user.password)
        if(!isPasswordValid){
            const error = new Error('Invalid credential');
            error.statusCode = 401;
            error.cause = "Password and email is not correct"
            throw error;
        }
        const token = jwt.sign({
            email: user.email,
            id : user.id
        } ,'NAUFALFADHILSECRETKEYYOUKNOWITISASECRET' , { expiresIn : '7d' }  );
        res.status(200).json({
            token : token,
            message : "Success Login"
        })
    }catch(err){
        next(err);
    }
};