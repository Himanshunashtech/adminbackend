import { Router } from "express"
const fileuploader = Router()
import { upload } from "../middlewares/multer.js"
import { mediaHandler } from "../middlewares/multer.js"
import { auth } from "../middlewares/auth.js"
import { AdminAuth } from "../utils/adminAuth.js"
import {  uploadGalleryMedia, deleteMedia, show } from "../controllers/galleryController.js"



// fileuploader.post("/updateuser" , mediaHandler().array("avatar",2),auth,AdminAuth  )



fileuploader.post("/upload_media",auth,AdminAuth,mediaHandler().array("assets"), uploadGalleryMedia)

fileuploader.get("/show_media",auth,AdminAuth,show)
fileuploader.delete("/delete_media/:id/:assetsId",auth,AdminAuth,deleteMedia)


export default fileuploader