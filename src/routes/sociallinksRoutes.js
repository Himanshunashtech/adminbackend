import express, { Router } from "express"
import { addlinks, deletelinks, allLinks, updatelinks } from "../controllers/sociallinksController.js"
import { auth } from "../middlewares/auth.js"
const uploadlinks = Router()

uploadlinks.get("/all_links",auth,allLinks)
uploadlinks.post("/add_link",addlinks)
uploadlinks.put("/update/:id",updatelinks)                                                 
uploadlinks.delete("/delete/:id",deletelinks)

export default uploadlinks

