import express, { Router } from "express"

const router = Router()
import { deleteUserById, loginUser, logoutUser, registerUser, allUsers, resetPassword, updateUser, userCount ,getProfile} from "../controllers/userController.js"
import { upload,mediaHandler } from "../middlewares/multer.js"
import { auth } from "../middlewares/auth.js"
import { AdminAuth } from "../utils/adminAuth.js"

router.post(
    "/updateuser",
    mediaHandler().fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]),
    auth,
    AdminAuth,
    updateUser
  );


router.post("/register", registerUser)
router.get("/all_users",auth,AdminAuth, allUsers)
router.get("/user_profile",auth, getProfile)
router.post("/login", loginUser)
// router.post("/updateuser", auth,  upload.single([
    // {
    //     name: "avatar",
    //     maxCount: 1
    // }]),updateUser)
// router.post("/updateavatar", auth, upload.single([
//     {
//         name: "avatar",
//         maxCount: 1
//     }])
//     , updateavatar)

// router.get("/sorting",sorting)    
// router.get("/search",search)    
router.put("/reset_password", auth,AdminAuth, resetPassword)
router.delete("/delete/:id",auth, deleteUserById)
router.post("/logout",auth, logoutUser)
router.get("/total_user",auth, userCount )




export default router