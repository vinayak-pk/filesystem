 const express = require('express');
 const Users = require('../models/user.model');
 const jwt = require('jsonwebtoken') 
 const router = express.Router();
 const fs = require('fs');
 const path = require('path');
 require('dotenv').config();
 let newToken = (user)=>{
    return jwt.sign({_id:user._id},process.env.jwt_secret)
 }

 router.get('/',async (req, res)=>{
     let users = await Users.find().lean().exec();
     res.send(users)
 })

 router.post('/register',async (req, res)=>{
    try{
        let user =await Users.findOne({email:req.params.email}).lean().exec();
        if(user){
           return res.status(401).send({err:"User already registered"})
        }
        var newUser =await Users.create(req.body);
       
        fs.mkdir(path.join(__dirname, `../files/${newUser._id}`),(err) => {
            if (err) {
                 console.log(err);
            }else{
                console.log('Directory created successfully!');

            }
        });
        res.status(200).send({status:"Success"});
    }
    catch(err){
        console.log(err)
        res.status(200).json({status:"Error",message:"Something went wrong"})
    }
  
 })

 router.post('/login',async (req, res)=>{
    try{
        let user =await Users.findOne({email:req.body.email});
        if(!user){
           return res.status(401).send({err:"User does not exist, Please register"});
        }
        const match =await user.checkPassword(req.body.password);

        if(!match){
            return res.status(401).json({err:"Email or password is incorrect"})
        }
        let token = newToken(user);

        res.status(201).json({status:"success",token})
    }
    catch(err){
        res.status(200).json({status:"Error",message:"Something went wrong"})
    }
   
 })

 module.exports = router;