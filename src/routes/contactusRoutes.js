import { Router } from "express"
import  {  queryMessage,deleteAllQueryMessage, deleteMessageById,getAllMessages } from "../controllers/contactusController.js"
import { auth } from "../middlewares/auth.js"
import { AdminAuth } from "../utils/adminAuth.js"
const contactUs = Router()

contactUs.get("/get_messages",auth,AdminAuth,getAllMessages)
contactUs.post("/contact_us",queryMessage)
contactUs.delete("/delete_all_message",auth,AdminAuth,deleteAllQueryMessage)
contactUs.delete("/delete_message/:id",auth,AdminAuth, deleteMessageById)


export default contactUs
