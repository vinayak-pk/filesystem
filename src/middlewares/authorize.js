const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user.model');

const verifyToken = (token)=>{
    return new Promise((resolve, reject)=>{
        jwt.verify(token,process.env.jwt_secret,(err,payload)=>{
            if(err) return reject(err);
            return resolve(payload);
        })
    })
}


const protect = async (req, res,next) =>{
   try{
     const bearerToken = req.headers.authorization;
     if(!bearerToken){
         return res.status(401).send({"err":"Please provide token"})
     }
     if(!bearerToken.startsWith("Bearer ")){
        return res.status(401).send({"err":"Please provide token properly"})

     }
    let token = bearerToken.split(" ")[1];
    let payload = await verifyToken(token);
    const user = await User.findById(payload._id).lean().exec();
    if(!user){
        return res.status(401).send({"err":"Please provide token properly"})

    }
    req.user = user;
    next()
   }
   catch(err){
    return res.status(401).send({"message":"You are not Authorized"})

   }
}

module.exports = protect;