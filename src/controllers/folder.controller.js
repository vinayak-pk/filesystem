const paths = require('path');
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authorize');
const Folder = require('../models/folder.model');
const Files = require('../models/file.model');
const bytesconv = require('../utils/bytesconv');
const fs = require('fs');

// getting folder and files inside a folder
router.get('/changedir/:parent',protect, async (req ,res)=>{
    try{
        const id = req.user._id;
        let parentfolder= req.params.parent;
        if(parentfolder!=="null"){   
            let checkfod = await Folder.findOne({userID:id,_id:parentfolder});  // checking if file exists
            if(!checkfod){
                return res.status(404).json({status:"error",messages:"Folder/Directory does not exist"});
    
            } 
        }
        let folds =await Folder.find({userID:id,parentFolder:parentfolder},{userID:0}).lean().exec();
        folds =  folds.map(async (fold)=>{
            let path=[];
                path = fold.path.split('/');
                for(let i=1;i<path.length;i++){
                    let f = await Folder.findById(path[i]);
                    path[i] = f.name;
                }
                fold.path=path.join('/');
                fold.folder=true;
                return fold;
        }); // adding necessary details including getting the foldernames according to folder id for getting the path of the folder
        folds = await Promise.all(folds)
        let files = await Files.find({userID:id,parentFolder:parentfolder},{userID:0}).lean().exec();
        // console.log(files);
        files =  files.map(async (file)=>{
            if(file.parentFolder==="null"){
                file.path= "root";
            }else{
                let path=[];
                let f = await Folder.findById(file.parentFolder);
    
              
                    path = f.path.split('/');
                    for(let i=1;i<path.length;i++){
                        let f = await Folder.findById(path[i]);
                        path[i] = f.name;
                    }
                    file.path=path.join('/');
            } // adding necessary details including getting the foldernames according to folder id for getting the path of the folder
            const extension = paths.extname(file.name)||null;
            file.size = bytesconv(file.size);
            
            file.created = file._id.getTimestamp();
                file.folder=false;
                return file;
        });
        files = await Promise.all(files)
        files = [...folds,...files];
        res.status(200).json({status:"Success",files:files}); 
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});

    }

   
})

//folder creation
router.post('/create/folder',protect, async (req ,res)=>{
    try{
        let {fname}  = req.body;
        const id = req.user._id;
       let fpath="";
       let parentfolder = req.body.parent;
       if(parentfolder!=="null"){
           let getPar = await Folder.findById(parentfolder) //getting the parent folder
           fpath= getPar.path;
       }else{
           fpath="root"
       }
       let folder = await Folder.create({name:fname,path:"pending",parentFolder:parentfolder,userID:id});
       let loc = `${fpath}/${folder.id}`
      
       folder = await Folder.findByIdAndUpdate(folder.id,{path:loc}) //updating the path 
        res.status(201).json({status:"Success"});
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});

    }
 
})
//deleting an empty folder
router.delete('/remove/folder/:id',protect, async (req ,res)=>{
    try{
       fid=req.params.id;
       const id = req.user._id;
       let folds= await Folder.find({userID:id,parentFolder:fid});
       let files = await Files.find({userID:id,parentFolder:fid});
       files= [...files,...folds];
       if(files.length>0){  // to check if the folder is empty
           return res.status(403).json({status:"error",error:"Folder is not empty"})
       }
        files= await Folder.deleteOne({userID:id,id:fid});
        console.log(files)
       res.status(200).json({status:"Success"});
    }catch(err){
        console.log(err)
       res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
   }
   
});
//renaming folder or file
router.patch('/rename/:id',protect, async (req ,res)=>{
    try{
        const id = req.params.id;
        let {newname,folder=false}  = req.body;
        let update;
        if(folder){
            let fold = await Folder.findById(id);
            let userid = req.user._id.toString();
            let folduser = fold.userID.toString();
            console.log(userid,folduser)
            if(folduser!==userid){ // authorizing the user for the operation
                return res.status(401).json({status:"error",error:"Unauthroized"})
            }
         
             update = await Folder.updateOne({_id:id},{name:newname});
        }else{
             update =await Files.updateOne({_id:id},{name:newname});
        }
        res.status(200).json({status:"Success",update});   
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }
 })

//moving a folder
 router.patch('/move/folder/:id',protect, async (req ,res)=>{
    try{
        const id = req.params.id;
        let userID = req.user._id;
        let {newfold} = req.body;
        if(newfold==="null"){
            let fold =await Folder.findById(id);
            if(req.user._id.toString()!==fold.userID.toString()){ // authorizing the user for the operation
                return res.status(401).json({status:"error",error:"Unauthroized"})

            }
            let path = `root/${fold._id}`
            let update =await Folder.updateOne({_id:id},{parentFolder:"null",path:path});
           return res.status(200).json({status:"Success",update});   
        } 
        let fold = await Folder.findById(newfold);
        if(req.user._id.toString()!==fold.userID.toString()){
            return res.status(401).json({status:"error",error:"Unauthroized"})

        }
        let update =await Folder.updateOne({_id:id},{parentFolder:newfold,path:fold.path});
        
        res.status(201).json({status:"Success",update});   
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }
 });

module.exports = router;