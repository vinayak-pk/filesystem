const paths = require('path');
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authorize');
const upload = require('../utils/file-upload');
const Files = require('../models/file.model');
const {createFile,removeFile,getFile} = require('../utils/fileops')
const fs = require('fs');

// file creation
router.post('/create/file',protect, async (req ,res)=>{
    try{
        let {fname}  = req.body;
        var content = req.body.content||""
        if(!fname){
           return res.status(404).json({status:"error",message:"Please send proper file name or path"});
        }
        const id = req.user._id;
     
        // if(fid=="null"){
        //     fid=id;
        // }
        const extension = paths.extname(fname)||null;

        let file = await Files.create({name:fname,userID:id,location:"pending",parentFolder:req.body.parent||"null",size:"0"})
        let loc = `${file._id}${extension}`;
        createFile(loc,content,file._id)
        
        res.status(201).json({status:"Success"});
        

    }catch(err){
         console.log(err);
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }

   
 })


// Deleting a file
 router.delete('/remove/file/:id',protect, async (req ,res)=>{
    try{
        let fid = req.params.id;
        let file =await Files.findById(fid);
        if(!file){
            res.status(404).json({status:"error",messages:"No file found"});
        }
        let userid = req.user._id.toString();
        let fileuser = file.userID.toString();
        if(fileuser!==userid){ // authorizing the user for the operation
            return res.status(401).json({status:"error",error:"Unauthroized"})
        }
        await Files.deleteOne({_id:fid});
        const extension = paths.extname(file.name);
        removeFile(`${fid}${extension}`);
        res.status(200).json({status:"Success"});   
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }
 });

// Uploading files
 router.post('/upload',protect,upload.array("files"), async (req ,res)=>{
    try{
        
        let file = await Files.updateOne({_id:req.fdetails},{location:req.files[0].location,size:req.files[0].size})

        res.status(200).json({status:"Success",file:file});  
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }
 })

//Getting a file
 router.get('/getFile/:id',protect, async (req ,res)=>{
    try{
        const fid = req.params.id;
        let checkFile = await Files.findById(fid);
        let userid = req.user._id.toString();
        let fileuser = checkFile.userID.toString();
        if(fileuser!==userid){ // authorizing the user for the operation
            return res.status(401).json({status:"error",error:"Unauthroized"})
        }
        if(!checkFile){
            return res.status(404).json({status:"error",messages:"No file found"});  
        
        }  
        const extension = paths.extname(checkFile.name)||null;
        let key = `${id}${extension}`
        let output = getFile(key);
        return res.status(200).json({status:"success",path:output.location});  
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }
 });
 
// Moving a file
 router.patch('/move/file/:id',protect, async (req ,res)=>{
    try{
        const id = req.params.id;
        let {newfold} = req.body;
        let checkFile = await Files.findById(id);
        let userid = req.user._id.toString();
        let fileuser = checkFile.userID.toString();
        console.log(userid,fileuser)
        if(fileuser!==userid){ // authorizing the user for the operation
            return res.status(401).json({status:"error",error:"Unauthroized"})
        }
        let update =await Files.updateOne({_id:id},{parentFolder:newfold});

        res.status(200).json({status:"Success",update});   
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }
 });
module.exports = router;