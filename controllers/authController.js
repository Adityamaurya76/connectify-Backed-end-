const User = require('../models/User');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const { error, success } = require('../utils/responseWrapper');
  
const signupController= async( req , res) =>{
    try {
    const{name,email,password }=  req.body;
  if(!email || !password || !name){
    return res.send(error(400, "all feilds are require"));
  }

   const oldUser = await User.findOne({email});
    if(oldUser){
      //  return res.status(409).send(" User is already registered");
        return res.send(error(409, " User is already registered"));
    }

    const hashpassword= await bcrypt.hash(password, 10);
   
    const user= await User.create({
      name,
      email,
      password: hashpassword  
    });

    const newUser= await User.findById(user._id);
    
    // return res.status(201).json({
    //     user
    // })

    return res.send(success(201,'user created successfully')
    );

    } catch(e){
    return res.send(error(500,e.message));
    }
}

const loginController = async( req , res ) =>{
try {
 
  const{email,password }=  req.body;
  if(!email || !password){
  return res.send(error(400, 'all fileds are require'))

  }

   const user = await User.findOne({email}).select('+password');
    if(!user){
     //   return res.status(404).send();
       return res.send(error(404," User is not registered"));
    }
    const matched= await bcrypt.compare(password, user.password);
   if(! matched){
  //  return res.status(403).send(");
    return res.send(error(403," incorrect password"));
   }

   const accesstoken= generateAccessToken({
    _id:  user._id 
  });
  const refreshToken =generateRefreshToken({
    _id: user._id,
  });
 
     res.cookie('jwt',refreshToken,{
      httpOnly:true,
      secure:true
     })

    return res.send(success(200,{accesstoken,}));

} catch(e){
  return res.send(error(500,e.message));
  }
};
//this Api will check teh refreshToken validity and generate a new access key
 const refreshAccessTokenController= async(req, res) =>{
 const cookies= req.cookies;
  if(!cookies.jwt){
 //  return res.status(402).send();
   return res.send(error(401,"Refresh token in cookie is reuired"))
}

  const refreshToken= cookies.jwt
   
    try{
 
      const decoded= jwt.verify(refreshToken,
          process.env.REFRESH_TOKEN_PRIVATE_KEY
          );

        const  _id= decoded._id;
        const accessToken = generateAccessToken({ _id});
        return  res.send(success(201,{accessToken}));
 
  }catch(e){
      console.log(e);
 // return res.status(401).send("");
   return res.send(error(401, "Invalid refresh token"));
  }


 };

 const logoutController =async (req, res)=>{
    try{
       res.clearCookie('jwt',{
        httpOnly:true,
        secure:true,
       })
         return res.send(success(200, 'user logged out'));
    }catch(e){
         return res.send(error(500,e.message));
    }
 }


const generateAccessToken=(data) =>{
  try{
    const token=  jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn:"1d"
    });
    console.log(token);
    return token;
  } catch(error){
    console.log(error);
  }

};



const generateRefreshToken=(data) =>{
  try{
    const token=  jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn:"1y"
    });
    console.log(token);
    return token;
  } catch(error){
    console.log(error);
  }

};


module.exports={
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController
};