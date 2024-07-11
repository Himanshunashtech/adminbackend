import { Gallery } from "../models/galleryModel.js";
import { Press } from "../models/pressManagementModal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import fs from "fs"
import path from "path";
// import { uploadtAtCloudinary } from "../utils/cloudinary.js";

const validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({status:501, success: false, message: "Invalid ID" });
    }
    return true; 
};


const uploadMedia = asyncHandler(async (req, res) => {
    const { mediaLink, title } = req.body;
    const creatorId = req.user._id;
  
    if (!validateId(creatorId)) {
      return res.json({status:501, success: false, message: "Invalid ID" });
    }
  
    if (!mediaLink || !title) {
      return res.json({ status:400,success: false, message: "Please fill all the details" });
    }
  
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({status:401, success: false, message: "No files were uploaded." });
      }

      let mediaFilePath = req.files.news ? req.files.news[0].filename : '';
      if(!mediaFilePath){
        return res.json({status:402, success: false, message: "Please provide news media"})
      }
      let logoFilePath = req.files.logo ? req.files.logo[0].filename : '';
  
    try {
      const pressMedia = await Press.create({ mediaLink, creatorId, title, newsFile: mediaFilePath, logoFile: logoFilePath });
      res.json({status:201, success: true, message: "New media file uploaded", pressMedia });
    } catch (error) {
      return res.json({status:500, sucess:false, message: "Internal server error" });

    }
  });
  


// const uploadMedia = asyncHandler(async (req, res) => {
//     const { mediaLink, title } = req.body;

//     const creatorId = req.user._id;



//     if (!validateId(creatorId)) {
//         return res.status(400).json({ success: false, message: "Invalid ID" });
//     }

//     if (!mediaLink || !title) {
//         return res.status(400).json({ success: false, message: "Please fill all the details" })
//     }


//     let mediaFilePath = req.files.news ? req.files.news[0].filename : null;
//     let logoFilePath = req.files.logo ? req.files.logo[0].filename : null;
  

//     // if (req.files) {
//     //     req.files.forEach(image => {
//     //         if (image.filename.includes("news")) {
//     //             mediaFilePath = image.filename;
//     //             console.log("mediaFilePath", mediaFilePath)
//     //         }
//     //         if (image.filename.includes("logo")) {
//     //             logoFilePath = image.filename;
//     //             console.log("logofilepath", logoFilePath);
//     //         }
//     //     });
//     // }

//     try {
//         const pressMedia = await Press.create({ mediaLink, creatorId, title, newsFile: mediaFilePath, logoFile: logoFilePath })
//         res.status(201).json({ sucess: true, message: "new mediafile uploaded", pressMedia })
//     } catch (error) {

//         console.error("Error:", error);
//         return res.status(500).json({ sucess: false, error: "Internal server error" });
//     }


// })

const deleteitem = asyncHandler(async (req, res) => {
    const id = req.params.id;
    
  
    if (!validateId(id)) {
      return res.json({status:501, success: false, message: "Invalid ID" });
    }
  
    try {
      const item = await Press.findByIdAndDelete(id);
      if (!item) {
        return res.json({status:400, success: false, error: "Item not found" });
      }
  
      // Delete the associated files from the local storage
      if (item.newsFile && fs.existsSync(path.join('public/images', item.newsFile))) {
        fs.unlink(path.join('public/images', item.newsFile), (err) => {
          if (err) {
            console.error(`Error deleting news file: ${err.message}`);
          }
        });
      }
  
      if (item.logoFile && fs.existsSync(path.join('public/images', item.logoFile))) {
        fs.unlink(path.join('public/images', item.logoFile), (err) => {
          if (err) {
            console.error(`Error deleting logo file: ${err.message}`);
          }
        });
      }
  
      return res.json({status:201, success: true, message: "Item deleted successfully" });
    } catch (error) {
      return res.json({status:500, sucess:false, message: "Internal server error" });

    }
  });
  
  
  

const updatemedialink = asyncHandler(async (req, res) => {
    try {
        const { id, mediaLink, title } = req.body;

        if (!validateId(id)) {
          return res.json({status:501, success: false, message: "Invalid ID" });
        }
        const item = await Press.findByIdAndUpdate(id, { mediaLink, title }, { new: true })
        if (!item) {
            return res.json({status:400,
                sucess: false, error: "item not found"
            });
        }
        return res.json({status:201,
            sucess: true, message: "item updated successfully",
            item
        });
    } catch (error) {
      return res.json({status:500, sucess:false, message: "Internal server error" });

    }
})
const getmediaLinks = asyncHandler(async (req, res) => {

    try {
        const items = await Press.find({})
        if (!items) {
            return res.json({status:400,
                sucess: false, error: "item not found"
            });
        }

        return res.json({status:201, sucess: true, message: "items are reterived", items })
    } catch (error) {
      return res.json({status:500, sucess:false, message: "Internal server error" });


    }
}

)













export { uploadMedia, deleteitem, updatemedialink, getmediaLinks }