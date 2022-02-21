const fs = require('fs');
const paths = require('path');
const s3 = require('../config/storage')
const mime = require('mime-types');
const Files = require('../models/file.model');

const createFile = (path,fileContent,id)=>{
    const params = {
        Bucket: 'files-systems', // pass your bucket name
        Key: path, // file will be saved as testBucket/contacts.csv
        Body: fileContent,
        contentType: mime.lookup(path)
    };
    s3.upload(params,async function(s3Err, data) {
        if (s3Err) throw s3Err
        console.log(data)
        let file = await Files.updateOne({_id:id},{location:data.Location,size:data.size})
        console.log(id,file)
        console.log(`File uploaded successfully at ${data.Location}`)
    });  
     
        
}

const removeFile = (key)=>{
    var params = {  Bucket: 'files-systems', Key: key };

    s3.deleteObject(params, function(err, data) {
      if (err){
        console.log(err, err.stack);  // error
    } else{

        console.log("File Deleted")     
    }
    });
}

const getFile = (key)=>{
    var file;
    var params = {
        Bucket: "files-systems", 
        Key: key
       };
    s3.getObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else{
            console.log(data); 
            file = data
        }     
    })
    return file;
}

module.exports = {createFile,removeFile};
    
    