const fs = require('fs');
const paths = require('path');

const createDir = (path)=>{
    fs.mkdirSync(path,{recursive: true}, (err)=>{
        if(err){
            return console.log(err)
        }
        console.log('Directory created')
    });
} 

const createFile = (path,fileContent)=>{
        fs.writeFile(path,fileContent,(err)=>{
            if(err){
                return console.log(err)
            }
           console.log('File created')
        })
     
        
}

module.exports = {createDir,createFile};
    
    