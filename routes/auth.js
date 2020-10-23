const express = require('express');
const {body} = require('express-validator');

const router = express.Router();

const authController = require('../controllers/user')

router.put('/signup' , [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.'),
    body('password')
        .trim()
        .isLength({min:5})
        .withMessage('Minimum of password length is 5')
        ,
    body('name')
        .trim()
        .not()
        .isEmpty() 
        .withMessage('Name must not be empty')

], authController.signup);

router.post('/login', authController.login)

module.exports = router