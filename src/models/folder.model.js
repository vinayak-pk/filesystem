const {Schema,model} = require('mongoose');

const folderSchema = Schema({
      name:{type:String,default:"New folder"},
      userID:{type:Schema.Types.ObjectId,ref:'user'},
      path:{type:String,required:true},
      parentFolder:{type:String,required:true}
})

module.exports = model('folder', folderSchema);