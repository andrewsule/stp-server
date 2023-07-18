const jwt = require('jsonwebtoken')

let authentication = (req,res,next)=>{
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(401).json({message:"Authorization Denied"})
    }
    try{
        let decode =jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user=decode.user
        next()
    }
    catch(error){
        res.status(401).json({message:"Token not Valid"})
    }
}

module.exports = authentication;
