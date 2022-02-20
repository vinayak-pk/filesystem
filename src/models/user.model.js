const {Schema,model} = require('mongoose');

const bcrypt = require('bcrypt');

const userSchema = Schema({
    name:{type: String,required: true},
    email:{type: String,required: true,unique: true,},
    password:{type: String,required: true}
})

userSchema.pre("save",function(next){
    if(!this.isModified("password")){
        return next();
    }
  let hashedpassword = bcrypt.hashSync(this.password,10);
  this.password = hashedpassword;
  next();
})

userSchema.methods.checkPassword = function(password){
    const hashedpassword = this.password;
    return new Promise(function(resolve, reject){
        bcrypt.compare(password,hashedpassword,(err,same)=>{
            if(err){
                return reject(err);
            }
            return resolve(same);
        })
    })
}

module.exports = model('user',userSchema);