const bcrypt =require("bcryptjs");
const jwt =require("jsonwebtoken")
const User = require("../models/user")

const register =async (req,res,next)=>{
   try {
       const {name,email,password} = req.body;
       
    //    check required feild
    if(!name || !email || !password){
        return res.status(400).json ({
            success:false,
            message:"Name,email and password are required"
        })
    }
    // check if user  already exists
    const existingUser= await User.findOne({email})

    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User already exists"
        })
    }
// hash password
const hashedPassword =await bcrypt.hash(password,10)

// create user
const user=await User.create({
    name,email,
    password:hashedPassword
})

res.status(200).json({
    sucsess:true,
    message :"User registered sucessfully",
    data :{
        id :user._id,
        name :user.name,
        email:user.email,
        role:user.role
    }
})
   } catch (error) {
    next(error)
   }
}

// Login

const login = async (req,res,next)=>{
   try {
      const {email,password} = req.body
    //   check fields
    if(!email || !password){
        return res.status(400).json({
            success : false,
            message:"Email and password are required"
        })
    }
    // Find user
    const user = await User.findOne({email})

    if(!user){
        return res.status(401).json({
             success :false,
        message: "invalid email or password"
        })
       
    }

    // Compare password 
    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        return res.status(401).json({
            success :false,
            message:"Invalid email or password"
        })
    }
// Generate jwt
const token = jwt.sign(
    {
        id: user._id,
        role:user.role
    },
    process.env.JWT_SECRET,{expiresIn:"1d"}
)
// store jwt in http-only cookie
res.cookie("token",token, {
    httpOnly:true,
    secure:false,
    sameSite:"lax",
    maxAge: 24 * 60 * 60 *  1000
})


res.status(200).json({
    success :true,
    message :"Login successful",
    user:{
        id:user._id,
        name :user.name,
        email :user.email,
        role: user.role
    }
})

   } catch (error) {
    next(error)
   }
}

// Logout 
const logout = (req,res)=>{
res.clearCookie("token")
 res.status(200).json({
    success :true,
    message : "Logout successful"
 })
}



module.exports= {
    register,
     login,
     logout
}