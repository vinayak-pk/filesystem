const multer = require("multer");
const path = require("path");
const Files = require('../models/file.model');
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, `../files/`));
  },
  filename:async function (req, file, callback) {

    const id = req.user._id;
    const extension = path.extname(file.originalname)||null;
    let f = await Files.create({name:file.originalname,userID:id,parentFolder:req.body.parent||"null"})
    let filename = `${f._id}${extension}`
    callback(null,filename);
  },
});


module.exports = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  }
});
