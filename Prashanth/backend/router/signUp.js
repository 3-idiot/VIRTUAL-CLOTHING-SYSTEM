const router =require('express').Router();
let User = require ('../model/user.model');
let UserSession = require('../model/userSession.model');

// Not Needed
// router.route('/').get((req,res) => {
//   User.find()
//             .then(User=>res.json(User))
//             .catch(err =>res.status(400).json('Error'+err) )
// });

router.route('/signUp').post((req,res)=>{

  const name = req.body.name;
  let email = req.body.email;
  const password = req.body.password;
  
  email=email.toLowerCase();

  //verify mail
  User.find({ 

    email:email
    
  },(err,previousUser)=>{

    if(err){
      res.json({"Error":"Server Error" ,"message":err.message})
    } else if(previousUser.length > 0){
       res.json({"message":'Already Exited'})
    } else {
       //save the User
      const newUser = new User({name,email,password});
      newUser.save((err,doc)=>{
              if(err){
                res.json({"Error":"Server Error" ,"message":err.message})
                }

              res.json({'success':'true',"message":"Signed Up ", token:doc._id});
            
              });
      //             .then(()=>res.json({'success':'true',"message":"Signed Up " , token:_id}))
      //             .catch(err => res.status(400).json('Error'+ err))
      // } 
      
   };

    });
});
router.route('/signIn').post((req,res)=>{ 

  let email = req.body.email;
  const password = req.body.password;
  
  email=email.toLowerCase() ;

  
// verify E-mail was SignedUp
   User.find({ 

    email:email
    
   },(err,user)=>{
    if(err){
      res.json({"Error":"Server Error" ,"message":err.message})
    }else if(!user.length ){
      res.json({"message":'Invalid Email or User not SignUp'})
    }else{
      
      //verify E-mail and  Password matches
      User.find({

        email:email,
        password:password

        },(err,users)=>{

        if(err){
          res.json({"Error":"Server Error" ,"message":err.message})
        }else if(users.length !=1 ){
          res.json({"Error" : "Invalid","message":' Password is Invalid'}) // res.json({"Error" : "Invalid","message":'E-mail or Password is Invalid'})
        } else{
          //in validPassword
          const user=users[0];

          //For bcrypt hasing 
          // if(!user.validPsassword(password)){
          //     res.json('Error :Invalid Password')
          // }

          //Correct user
          try{
            
          const userSession =new UserSession();
            userSession.userId = user._id;
            userSession.save((err,doc)=>{
              if(err){
                res.json({"Error":"Server Error" ,"message":err.message})
                }

              res.json({'success':'true',"message":"Signed In ", token:doc._id});
            
              });
          
          }catch(err){
            console.log( "MyError"+err);
          }
        }
      });
    
  }});

});

router.route('/verify').get((req,res)=>{

  const token =req.query.token;

  UserSession.find({
    _id:token,
    isDeleted:false
    },(err,session)=>{

    if(err){
      res.json({"Error":"Server Error" ,"message":err.message})
      } 
    else {
      res.json({"success":"true","message":"Verify"})
      }
  });
});

router.route('/logout').get((req,res)=>{

  const token =req.query.token;

  UserSession.updateOne({
    _id :token,
    isDeleted:false
    },{
        $set:{isDeleted:true}
    },(err,session)=>{
      
    if(err){
       res.json({"Error":"Server Error" ,"message":err.message})
    } 
    
    res.json({"success":"true","message":"logout  "})
    
  });
});

module.exports=router;