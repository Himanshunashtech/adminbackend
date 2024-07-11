import Contactus from "../models/contactusModel.js";
import { Users } from "../models/usersModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({status:501, success: false, message: "Invalid ID" });
    }
    return true; // Valid ID
};


const queryMessage = asyncHandler(async (req, res) => {
    const { email, message, subject, senderId } = req.body
    try {


        if (!validateId(senderId)) {
            return res.json({status:501, success: false, message: "Invalid ID" });
        }

        if (!email || !message || !subject) {
            return res.json({staus:400, success: false, message: "Please fill all the fields" })
        }
        const sender = Users.findById(senderId)
        if (!sender) {
            return res.json({atatus:400, success: false, message: "no user found" })
        }
        const newMessage = await Contactus.create({ email, message, subject, senderId })

        return res.json({
            status:200,
            success: true, message: "Message sent successfully", data: newMessage
        })
    }
    catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });

    }

}
)

const deleteMessageById = asyncHandler(async (req, res) => {
    const id = req.params.id
    try {

        if (!validateId(id)) {
            return res.json({status:501, success: false, message: "Invalid ID" });
        }

        const queryMessages = await Contactus.findByIdAndDelete(id)

        if (!queryMessages) {
            return res.json({status:400, success: false, message: "No messages found" })
        }
        return res.json({status:201, success: true, message: "Message deleted successfully" })

    }

    catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });

    }
})



const deleteAllQueryMessage = asyncHandler(async (req, res) => {
    const queryMessages = await Contactus.deleteMany({})
    try {
        return res.json({ status:201, success: true, message: "All Message Deleted successfully" })
    }
    catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });

    }
})


const getAllMessages = asyncHandler(async (req, res) => {
    const queryMessages = await Contactus.find({})

    try {

        if (!queryMessages) {
            return res.json({status:400, success: false, message: "No messages found" })
        }
        return res.json({status:201, success: true, message: "All Message" })

    }
    catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });

    }

})





export { queryMessage, deleteMessageById, deleteAllQueryMessage, getAllMessages }