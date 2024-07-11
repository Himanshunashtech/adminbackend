import express, { Router } from "express"
import { addContent, deleteContentById, showcontent, updateContent } from "../controllers/contentmanagementContoller.js"
import { AdminAuth } from "../utils/adminAuth.js"
import { auth } from "../middlewares/auth.js"
import { mediaHandler } from "../middlewares/multer.js"

const contentuploader = Router()


contentuploader.get("/show",showcontent)
contentuploader.post("/add_content",auth,AdminAuth, mediaHandler().single({ name: 'images' }),addContent)
contentuploader.put("/update_content/:id",auth,AdminAuth,updateContent)
contentuploader.delete("/delete/:id",auth,AdminAuth,deleteContentById)

export default contentuploader