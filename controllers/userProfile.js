const User = require("../models/user")
const bcrypt = require ("bcryptjs");

// Get loged in user profile
const getProfile=async(req,res,next)=>{
    try {
        const user= await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({
                success : false ,
                message :"User not found"
            })
        }
        res.status(200).json({
            success:true,
            data:user
        })
    } catch (error) {
        next(error)
    }
 }  
//  update loged in user profile
const updateProfile=async(req,res,next)=>{
    try {
        const{name,email} =req.body;
        const user =await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success : false,
                message:"User not found"
            })
        }

        // Update name if provided

        if (name){
            user.name = name
        }
        // update email if provided
        if(email){
            user.email= email;
        }
        await user.save();

        res.status(200).json({
            succcess : true,
            messsage:"Profile updated successfully",
            data:{
                id :user._id,
                name:user.name,
                email: user.email,
                role:user.role
            }
        })
    } catch (error) {
        next(error)
    }
}

// Delete own account

const deleteProfile = async(req,res,next)=>{
    try {
        const user =await User.findByIdAndDelete(req.user.id)

        if(!user){
            return res.status(404).json({
                success :false,
                message:"User not found"
            })
        }
    } catch (error) {
        next(error)
    }
}

// get all users- admin
const getUsers=async(req,res,next)=>{
    try {
        const users = await User.find().select("-password");
        res.status(200).json ({
            success : true,
            count:users.length,
            data : users
        })
    } catch (error) {
        next(error)
    }
}

// delete user -admin
const deleteUser = async(req,res,next)=>{
    try {
        
         const user =await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).json({
                success :false,
                message :"User not found"

            })
        }
        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
    } catch (error) {
        next (error)
    }
}


module .exports = {
    getProfile,
    updateProfile,
    deleteProfile,
    getUsers,
    deleteUser
}