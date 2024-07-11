
import { Gallery} from "../models/galleryModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadtAtCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import path from 'path'
import fs from 'fs'

const validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({status:501, success: false, message: "Invalid ID" });
    }
    return true; // Valid ID
};



const uploadGalleryMedia = asyncHandler(async (req, res) => {
    const { type  } = req.body;
    const creatorId=req.user._id;

    if (!validateId(creatorId)) {
      return res.json({status:501, success: false, message: "Invalid ID" });
    }

    if (!type) {
        return res.json({status:400,sucess:false, message: "Please fill all fields" })
    }

    let assetsFilePath =[];

    if (req.files) {
        req.files.forEach(image => {
            if (image.filename) {
                assetsFilePath.push(image.filename);
                // console.log("mediaFilePath", mediaFilePath)
            }
           
        });
    }

    try {
        // const videoFiles = await uploadtAtCloudinary(videoLocalFilePath);


        const galleryAssets = await Gallery.create({
            assets: assetsFilePath, creatorId,type
        })

        return res.json({status:201,sucess:true, message:"new file uploaded",galleryAssets})
    } catch (error) {
      
        return res.json({status:500, sucess:false, message: "Internal server error" });
    }


})





 const show = asyncHandler(async(req,res)=>{
    try {
        const {type}=req.body;
        if(!type){
            const allAssets = await Gallery.find({})
            return res.json({status:201,sucess:true,message:"assets",allAssets})

        }
         const item = await Gallery.find({type})
         if(!item){
            return res.json({status:400,sucess:false, message:"no video found"})
            }
        //   if(item.type===0){
        //     return res.status(200).json({sucess:true,message:"videos",item})
        //   }
        //   if(item.type===1){
            return res.json({status:201,sucess:true,message:"assets",item})
        //   }
           
    } catch (error) {
        console.error("Error:", error);
        return res.json({status:500, sucess:false, message: "Internal server error" });
       }
    }
    

      )


  
      const deleteMedia = asyncHandler(async (req, res) => {
        try {
          const { id, assetsId } = req.params;
          if (!validateId(id)) {
            return res.json({status:400, success: false, message: "Invalid ID" });
          }
      
          const galleryAssets = await Gallery.findById(id);
          if (!galleryAssets) {
            return res.json({status:404, success: false, error: "Gallery item not found" });
          }
      
          const assetIndex = galleryAssets.assets.indexOf(assetsId);
          if (assetIndex === -1) {
            return res.json({status:404, success: false, error: "Asset not found" });
          }
      
          const asset = galleryAssets.assets[assetIndex];
      
          // Determine the file path based on the asset type
          const filePath = asset.includes('.mp4')
            ? path.join('public/videos', asset)
            : path.join('public/images', asset);
      
          // Delete the file if it exists
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
      
          // Remove the asset from the array
          galleryAssets.assets.splice(assetIndex, 1);
      
          // Check if the assets array is now empty
          if (galleryAssets.assets.length === 0) {
            await Gallery.findByIdAndDelete(id);
            return res.json({status:200, success: true, message: "Gallery item and its assets deleted successfully" });
          } else {
            await galleryAssets.save();
          }
      
          return res.json({ status:201,success: true, message: "Asset deleted successfully" });
        } catch (error) {
          return res.json({status:500, sucess:false, message: "Internal server error" });

        }
      });
      


export { uploadGalleryMedia, deleteMedia ,show }