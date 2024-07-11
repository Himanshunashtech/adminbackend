import{v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv";
import fs from "fs"
dotenv.config({
    path: "./.env",
  });

cloudinary.config({ 
    cloud_name:process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECERET 
});

const uploadtAtCloudinary = async(localFilePath)=>{
    try{
        if(!localFilePath)return null
        const uploadResponse = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });
        
        return uploadResponse.url
     }catch(error){
        console.log(error)
        fs.unlinkSync(localFilePath)
     }
    }


export {uploadtAtCloudinary}