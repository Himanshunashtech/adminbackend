import SocialLinks from "../models/sociallinksModel.js";
import { Users } from "../models/usersModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({status:501, success: false, message: "Invalid ID" });
    }
    return true; // Valid ID
  };
  

const addlinks= asyncHandler(async(req,res)=>{
   try {
     const{title,url,creatorId}=req.body;

     if (!validateId(creatorId)) {
      return res.json({status:501, success: false, message: "Invalid ID" });
      }

      const user =await Users.findById(creatorId);

      if(!user){
        return res.json({status:400, success: false, message: "User not found"})
      }

    
     if(!title||!url){
         res.json({status:401,sucess:false,message:"provide all the fields"})
 
     }

     const titleExist = await SocialLinks.find({ title: title });
     const urlExist = await SocialLinks.find({ url: url });
     
     if (titleExist.length !== 0 || urlExist.length !== 0) {
         return res.json({status:402, success: false, message: "title or url already exist" });
     }
     
     // Proceed with your logic if the title or URL does not exist
     
     const sociallinks = await SocialLinks.create({title,url,creatorId})
     res.json({status:201,sucess:true,message:"social links added successfully",sociallinks
         })
 
   } catch (error) {
    return res.json({ status:500, success: false, message: "Internal server error" });

   }
})

const updatelinks = asyncHandler(async(req,res)=>{
   try {
     const socialId = req.params.id;
     
     if (!validateId(socialId)) {
      return res.json({status:501, success: false, message: "Invalid ID" });
      }

     if(!socialId){
         res.json({status:400,sucess:false,message:"provide the link"})
     }
         const sociallinks = await SocialLinks.findByIdAndUpdate(socialId,{url:req.body.url},{new:true})
         const newsociallinks= await sociallinks.save()
 
      res.json({status:201,sucess:true,message:"link updated",newsociallinks})
   } catch (error) {
    return res.json({ status:500, success: false, message: "Internal server error" });

   }

})

const deletelinks= asyncHandler(async(req,res)=>{
  try {
      const id=req.params.id;
      if (!validateId(id)) {
        return res.json({status:501, success: false, message: "Invalid ID" });
      }

      if(!id){
          res.json({status:400,sucess:false,message:"provide the link"})
          }
          await SocialLinks.findByIdAndDelete(id)
          res.json({status:201,sucess:true,message:"link deleted successfully"})
  
  } catch (error) {
    return res.json({ status:500, success: false, message: "Internal server error" });

  }
})

const allLinks =asyncHandler(async(req,res)=>{
    try {
        const sociallinks = await SocialLinks.find()
        if(!sociallinks||sociallinks.length===0){
            res.json({status:400,sucess:false,message:"Links not found"})
        }
        res.json({status:201,sucess:true,message:"social links",sociallinks})
    } catch (error) {
      return res.json({ status:500, success: false, message: "Internal server error" });

    }
})

export {addlinks,updatelinks,allLinks,deletelinks}