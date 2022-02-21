const paths = require('path');
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authorize');
const upload = require('../utils/file-upload');
const port = `${process.env.statichost}/static`;
const Files = require('../models/file.model');
const {createFile} = require('../utils/create')
const fs = require('fs');

// file creation
router.post('/create/file',protect, async (req ,res)=>{
    try{
        let {fname,fpath,fid}  = req.body;
        var content = req.body.content||""
        if(!fname){
           return res.status(404).json({status:"error",message:"Please send proper file name or path"});
        }
        const id = req.user._id;
     
        if(fid=="null"){
            fid=id;
        }
        const extension = paths.extname(fname)||null;
        let file = await Files.create({name:fname,userID:id,folderID:fid,parentFolder:req.body.parent||"null"})
        let loc = paths.join(__dirname, `../files/${file._id}${extension}`);
        await createFile(loc,content)
        
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
        let loc = paths.join(__dirname, `../files`);
        let file =await Files.findById(fid);
        let userid = req.user._id.toString();
        let fileuser = file.userID.toString();
        if(fileuser!==userid){
            return res.status(401).json({status:"error",error:"Unauthroized"})
        }
        await Files.remove({_id:fid});
        const extension = paths.extname(file.name);
        fs.unlinkSync(`${loc}/${fid}${extension}`)
        res.status(200).json({status:"Success"});   
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }
 });

// Uploading files
 router.post('/upload',protect,upload.array("files"), async (req ,res)=>{
    try{
        res.status(200).json({status:"Success"});  
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
        console.log(userid,fileuser)
        if(fileuser!==userid){
            return res.status(401).json({status:"error",error:"Unauthroized"})
        }
        if(!checkFile){
            return res.status(404).json({status:"error",messages:"No file found"});  
        
        }
        let path = paths.join(__dirname,`../files`)
        fs.readdirSync(path).forEach((file)=>{
            let fname = file.split('.')[0];
            if(fname===fid){
             let loc = `${port}/${file}`;
             return res.status(200).redirect(loc);  
            }
        })
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }
 })
// Moving a file
 router.patch('/move/file/:id',protect, async (req ,res)=>{
    try{
        const id = req.params.id;
        let {newfold,folder=false} = req.body;
        let checkFile = await Files.findById(id);
        let userid = req.user._id.toString();
        let fileuser = checkFile.userID.toString();
        console.log(userid,fileuser)
        if(fileuser!==userid){
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