const mongoose = require('mongoose');
/*
* Bcrypt
* npm install bcrypt
const bcrypt = require('bcrypt');
*/

const UserSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true,
    // minlength:3,
    // maxlength:15,

  },
  email:{
    type:String,
    trim:true,
    required:true,
  },
  password:{
    type:String,
    required:true,
    // minlength:3,
    // maxlength:15,

  },
  },{
  timestamps:true,
});

/*
* Hashing

UserSchema.methods.generateHashing=function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(0),null);
};

UserSchema.methods.vailPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

*/
module.exports=mongoose.model( 'User' , UserSchema);