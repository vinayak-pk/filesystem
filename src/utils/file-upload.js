const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const id = req.user._id;
    callback(null, path.join(__dirname, `../files/${id}/${req.body.fpath}`));
  },
  filename: function (req, file, callback) {
    callback(null,file.originalname);
  },
});


module.exports = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  }
});
