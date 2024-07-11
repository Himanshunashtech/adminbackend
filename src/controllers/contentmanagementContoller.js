import Content from "../models/contentmanagementModel.js"
import { Users } from "../models/usersModel.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose";



const validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({status:501, success: false, message: "Invalid ID" });
    }
    return true; // Valid ID
}; 



const addContent = asyncHandler(async (req, res) => {
    try {
        const { title, description, heading } = req.body;
        let creatorId = req.user._id.toString();

        console.log("Received creator ID:", creatorId);

        if (!validateId(creatorId)) {
            return res.json({status:501, success: false, message: "Invalid ID" });

        }

        const user = await Users.findById(creatorId);
        if (!user) {
            console.log("User not found");
            return res.json({status:400, success: false, message: "Invalid user ID" });
        }

        if (!title || !description || !heading) {
            console.log("Missing required fields");
            return res.json({status:401, success: false, message: "Please fill all fields" });
        }

        const presentcontent = await Content.findOne({ title });
        if (presentcontent) {
            console.log("Title already exists");
            return res.json({status:402, success: false, message: "Title already exists" });
        }
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.json({status:403, success: false, message: "No images were uploaded." });
          }

        let imageFilePath = req.files.image ? req.files.image[0].filename : '';

        if(!imageFilePath){
            return res.json({status:404, success: false, message: "Please provide images"})
          }


        const newContent = await Content.create({
            title,
            description,
            creatorId,
            heading,
            images:imageFilePath
        });

        console.log("Content created successfully");
        return res.json({status:201, success: true, message: "Content created successfully", newContent });
    } catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });

    }
});


const updateContent = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;

        if (!validateId(id)) {
            return res.json({status:501, success: false, message: "Invalid ID" });

        }

        const content = await Content.findById(id);
        if (!content) {
            return res.json({status:400, success: false, message: "Content not found" });
        }

        const { newdescription } = req.body;

        if (!newdescription) {
            return res.json({
                status:401,
                success: false, message: "Please fill all fields"
            });
        }

        content.description = newdescription;

        await content.save();

        return json({status:201, success: true, message: "Content updated successfully", content });
    } catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });

    }
});



const deleteContentById = asyncHandler(async (req, res) => {

   try {
     const id = req.params.id
     if (!validateId(id)) {
       
        return res.json({status:501, success: false, message: "Invalid ID" });

    }

 
     const content = await Content.findByIdAndDelete(id)
 
     if (!content) {
 
         res.json({status:400, sucess: false, message: "Content not found" })
     }
     
     if (item.images && fs.existsSync(path.join('public/images', item.images))) {
        fs.unlink(path.join('public/images', item.images), (err) => {
          if (err) {
            console.error(`Error deleting news file: ${err.message}`);   
          }
        });
      }
 
     res.json({status:201, sucess: true, message: "Content deleted successfully" })
   } catch (error) {
    return res.json({ status:500, success: false, message: "Internal server error" });

   }

})


const showcontent= asyncHandler(async(req,res)=>{
    try {
        const content = await Content.find({})
        if(!content||content.length === 0){
            res.json({status:400,sucess:false,message:"No content found" })
        }
        res.json({status:201,sucess:true,message:"content created succesfully" ,content})
    } catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });

    }
})




export { addContent, updateContent, deleteContentById,showcontent }