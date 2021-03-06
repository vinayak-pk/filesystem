const {Schema,model} = require('mongoose');

const fileSchema = Schema({
      name:{type:String,default:"New folder"},
      userID:{type:Schema.Types.ObjectId,ref:'user'},  
      parentFolder:{type:String,required:true},
      location:{type:String,required:true},
      size:{type:String}
})

module.exports = model('file', fileSchema);