import User from "../models/user.js";

export const updateCart=async (req,res)=>{
    try{
        const {userId,cartItems}=req.body;
        await User.findByIdAndDelete(userId,{cartItems})
        res.json({success:true,message:"Cart update"})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}