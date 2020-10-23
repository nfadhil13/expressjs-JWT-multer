const jwt = require('jsonwebtoken')

module.exports = (req , res , next) => {
    const token = req.get('Authorization')
    if(!token){
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        error.cause = "Please Use given authorization token"
        throw error
    }
    let decodedToken;
    try{
        decodedToken = jwt.verify(token , 'NAUFALFADHILSECRETKEYYOUKNOWITISASECRET');
    }catch(err){
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error

    }
    req.userId = decodedToken.userId;
    next();

}