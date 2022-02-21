const multer = require("multer");
const path = require("path");
const Files = require('../models/file.model');
const multerS3 = require('multer-s3');
const s3 = require('../config/storage');

module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'files-systems',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: async function (req, file, cb) {
      const id = req.user._id;
      let f;
      try{
         f = await Files.create({name:file.originalname,userID:id,location:"pending",parentFolder:req.body.parent||"null",size:"0"})

      }catch(err){
        console.log(err);
      }
      const extension = path.extname(file.originalname)||null;
      let filename = `${f._id}${extension}`;
      req.fdetails = f._id
      cb(null, filename)
    }
  })
})

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, path.join(__dirname, `../files/`));
//   },
//   filename:async function (req, file, callback) {

//     const id = req.user._id;
//     const extension = path.extname(file.originalname)||null;
//     let f = await Files.create({name:file.originalname,userID:id,parentFolder:req.body.parent||"null"})
//     let filename = `${f._id}${extension}`
//     callback(null,filename);
//   },
// });


// module.exports = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50,
//   }
// });
