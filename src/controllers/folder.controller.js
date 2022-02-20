const path = require('path');
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authorize');
const Folder = require('../models/folder.model');
const Files = require('../models/file.model');
// router.get('/',protect, async (req ,res)=>{
//     try{
//         const id = req.user._id;
//         let loc = path.join(__dirname, `../files/${id}`)
//         let files = getFile(loc);
    
//         res.status(200).json({status:"Success",files,path:"",parentfolder:null});
//     }catch(err){
//         console.log(err);
//         res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});

//     }
   
// })
// console.log(getFile(path.join(__dirname, `../files`)));
router.get('/searchfolder',protect, async (req ,res)=>{
    try{
        const id = req.user._id;
        let parentfolder= req.body.parent;
        
        console.log(id,parentfolder);
        if(parentfolder!=="null"){
            let checkfod = await Folder.findById(parentfolder);
            if(!checkfod){
                return res.status(400).json({status:"error",messages:"Folder/Directory does not exist"});
    
            } 
        }
        let folds =await Folder.find({userID:id,parentFolder:parentfolder}).lean().exec();
        folds =  folds.map(async (fold)=>{
            let path=[];
                path = fold.path.split('/');
                for(let i=1;i<path.length;i++){
                    let f = await Folder.findById(path[i]);
                    path[i] = f.name;
                }
                fold.path=path.join('/');
                return fold;
        });
        folds = await Promise.all(folds)
        let files = await Files.find({userID:id,parentFolder:parentfolder}).lean().exec();
        folds =  files.map(async (file)=>{
            if(file.parentFolder==="null"){
                file.path= "root";
            }else{
                let f = await Folder.findById(path[i]);
    
                let path=[];
                    path = f.path.split('/');
                    for(let i=1;i<path.length;i++){
                        let f = await Folder.findById(path[i]);
                        path[i] = f.name;
                    }
                    file.path=path.join('/');
            }

                return file;
        });
        folds = await Promise.all(folds)
        files = [...folds,...files];
        res.status(200).json({status:"Success",files:files});

    
        
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});

    }

   
})

router.post('/create/folder',protect, async (req ,res)=>{
    try{
        let {fname}  = req.body;
        const id = req.user._id;
       let fpath="";
       let parentfolder = req.body.parent;
       if(parentfolder!=="null"){
           let getPar = await Folder.findById(parentfolder)
           fpath= getPar.path;
       }else{
           fpath="root"
       }
       let folder = await Folder.create({name:fname,path:"pending",parentFolder:parentfolder,userID:id});
       let loc = `${fpath}/${folder.id}`
      
       folder = await Folder.findByIdAndUpdate(folder.id,{path:loc})
        res.status(200).json({status:"Success"});
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});

    }
 
})

router.delete('/remove/folder/:id',protect, async (req ,res)=>{
    try{
       fid=req.params.id;
       const id = req.user._id;
       let folds= await Folder.find({userID:id,parentFolder:fid});
       let files = await Files.find({userID:id,parentFolder:fid});
       files= [...files,...folds];
       if(files.length>0){
           return res.status("400").json({status:"error",error:"Folder is not empty"})
       }
        files= await Folder.deleteOne({userID:id,id:fid});
        console.log(files)
       res.status(200).json({status:"Success"});
    }catch(err){
        console.log(err)
       res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
   }
   
});

router.patch('/rename/:id',protect, async (req ,res)=>{
    try{
        const id = req.params.id;
        let {newname,folder=false}  = req.body;
        let update;
        if(folder){
            let fold = await Folder.findById(id);
            let mpath = fold.path.split('/');
            [mpath[mpath.length-1]]=[newname];
             update = await Folder.updateOne({_id:id},{name:newname,path:mpath});
        }else{
             update =await Files.updateOne({_id:id},{name:newname});
        }
        res.status(200).json({status:"Success",update});   
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }
 })

 router.patch('/move/folder/:id',protect, async (req ,res)=>{
    try{
        const id = req.params.id;
        let userID = req.user._id;
        let {newfold} = req.body;
        if(newfold==="null"){
            let fold =await Folder.findById(id);
            let path = `${userID}/${fold.name}`
            let update =await Folder.updateOne({_id:id},{parentFolder:"null",path:path});
           return res.status(200).json({status:"Success",update});   
        } 
        let fold = await Folder.findById(newfold);
        let update =await Folder.updateOne({_id:id},{parentFolder:newfold,path:fold.path});
        
        res.status(200).json({status:"Success",update});   
    }catch(err){
        console.log(err)
        res.status(404).json({status:"error",messages:"Something went wrong. Please try again"});
    }
 });

module.exports = router;