const User=require('../models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

function isstringinvalid(string){
    if(string==undefined||string.length==0){
        return true;
    }
    return false;
}

exports.postAddUser=async(req,res,next)=>{
    try{
   const username=req.body.name;
   const email=req.body.email;
   const password=req.body.password;

   if(isstringinvalid(username)||isstringinvalid(email)||isstringinvalid(password)){
   return res.status(400).json({message:"Something is missing"});
   }

   const userExist = await User.find({ email })
   if(userExist.length > 0){
    res.status(207).json({ message: 'User already exists with this email Id'})
} else {
    const saltrounds = 10;
    bcrypt.hash(password,saltrounds, async (err,hash) => {
        const userDetails = new User({  username, email, password: hash })
        userDetails.save();
       res.status(201).json({userDetails:userDetails});
      });
    }       
}catch(err){
        console.log(err);
    }
}

function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name}, process.env.TOKEN_SECRET);
}

exports.postLoginUser=async(req,res,next)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;

        if(isstringinvalid(email)||isstringinvalid(password)){
            res.status(400).json({message:"Something is missing"});
           }

           const registeruserExist = await User.find({ email : email })
        //   console.log( registeruserExist)
        //  console.log(registeruserExist[0]._id,registeruserExist[0].username);
           if( registeruserExist.length > 0){
            bcrypt.compare(password, registeruserExist[0].password,(err,result) => {
                if(err){
                    throw new Error("User not authorized");
                }
                if(result===true){
                    res.status(201).json({login:"Login succesful",token:generateAccessToken(registeruserExist[0]._id,registeruserExist[0].username)});   
                }else{
                    res.status(400).json({message:"password is incorrect"});
                }
            })
        }else{
            res.status(404).json({login:"User not found)"}); 
        }

     }catch(err){
             res.status(500).json({message:err});
         }
};