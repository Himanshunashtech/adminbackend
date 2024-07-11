import { asyncHandler } from "../utils/asyncHandler.js";
import { Users } from "../models/usersModel.js";

const AdminAuth = asyncHandler(async (req, res, next) => {
    const id = req.user._id.toString();
    const admin = await Users.findById(id);
    // 
    if (!admin || admin.role !== "Admin") {
        return res.status(400).json({ success: false, message: "You are not an admin" });
    }
    return next()
});

export {AdminAuth}