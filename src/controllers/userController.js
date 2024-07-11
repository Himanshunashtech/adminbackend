import { Users } from "../models/usersModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import mongoose from "mongoose";
import fs from 'fs'
import path from "path";




const validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({status:501, success: false, message: "Invalid ID" });
    }
    return true; // Valid ID
};


const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, password, email, role } = req.body;
    try {
        if (!firstName && !lastName && !password && !email) {

            return res.json({status:400, success: false, message: "Please fill all the required fields" })
        }
        if (!firstName ) {

            return res.json({status:401, success: false, message: "Please enter the firstname" })
        }
        if ( !lastName ) {

            return res.json({status:402, success: false, message: "Please enter the lastname" })
        }
        if ( !password) {

            return res.json({status:403, success: false, message: "Please enter the password" })
        }
        if (!email) {

            return res.json({status:404, success: false, message: "Please enter the email" })
        }
       

       
        const user = await Users.findOne({ email })

        if (user) {
            return res.json({status:405, success: false, message: "User already exists" })
        }

        const newUser = await Users.create({

            lastName,
            firstName,
            password,
            email,
            role,

        });
        return res.json({  status:201,success: true, message: "user created succesfully", newUser });
    } catch (error) {
        console.error("Error:", error);
        return res.json({status:500, success: false, message: "Internal server error" });
    }
})




const getProfile = asyncHandler(async (req, res) => {
    const id = req.user._id;
    try {
        const user = await Users.findById(id).select("-password");
        return res.json({
            status: 201,
            sucess: true,

            user
        })
    }
    catch (error) {
        return res.json({status:500, success: false, message: "Internal server error" });
    }




})


const allUsers = asyncHandler(async (req, res) => {
    const { firstname, email, order } = req.query;

    try {
        let queryObject = { role: "User" };

        if (firstname) {
            queryObject.firstname = {
                $regex: firstname,
                $options: "i",
            };
        }

        if (email) {
            queryObject.email = {
                $regex: email,
                $options: "i",
            };
        }

        let users = await Users.find(queryObject);

        if (!users || users.length === 0) {
            return res.json({status:400, success: false, message: "No users found" });
        }

        if (order) {
            const sortOrder = order === "asc" ? 1 : -1;

            users = await Users.aggregate([
                { $match: queryObject },
                { $sort: { firstname: sortOrder } }
            ]);

            const sortMessage = order === "asc" ? "Users sorted in ascending order" : "Users sorted in descending order";
            return res.json({
                status:201,
                success: true,
                message: sortMessage,
                users,
            });
        }

        return res.json(users);
    } catch (err) {
        return res.json({status:500, success: false, message: "Internal server error" });

    }
});








// const allUsers = asyncHandler(async (req, res) => {
//     try {
//         const users = await Users.find({ role: "User" });

//         if (!users || users.length === 0) {
//             return res.status(404).json({ success: false, message: "No users found" });
//         }

//         return res.status(200).json({ success: true, message: "Users found", users });
//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ success: false, error: "Internal server error" });
//     }
// });



// const search = asyncHandler(async (req, res) => {
//     const { username, email, } = req.query


//     if (!username && !email) {
//         return res.status(400).json("no data found")
//     }
//     const queryObject = {}
//     if (username) {
//         queryObject.username = {
//             $regex: username, $options: "i"
//         }
//     }

//     if (email) {
//         queryObject.email = {
//             $regex: email, $options: "i"
//         }
//     }

//     const users = await Users.find(queryObject)

//     if (!users || users.length === 0) {
//         return res.status(404).json({ success: false, message: "No users found" })
//     }
//     return res.json(users)
// })



// const sorting = asyncHandler(async (req, res) => {
//     const { order } = req.query;
//     let users;
//     try {
//         if (!order) {
//             return res.status(400).json({ success: false, message: "No order found" });
//         }

       

//         users = await Users.find({});
//     } catch (err) {
//         return res.status(400).json({ success: false, message: "Error finding users" });
//     }

//     if (users.length === 0) {
//         return res.status(400).json({ success: false, message: "No users found to sort" });
//     }

//     let sortedUsers;
//     if (order === "asc") {
//         try {
//             sortedUsers = await Users.aggregate([
//                 { $sort: { fullname: 1 } }
//             ]);
//         } catch (err) {
//             return res.status(400).json({ success: false, message: "Error sorting users in ascending order" });
//         }
//         return res.status(200).json({ success: true, message: "Users sorted in ascending order", sortedUsers });
//     }

//     if (order === "dsc") {
//         try {
//             sortedUsers = await Users.aggregate([
//                 { $sort: { fullname: -1 } }
//             ]);
//         } catch (err) {
//             return res.status(400).json({ success: false, message: "Error sorting users in descending order" });
//         }
//         return res.status(200).json({ success: true, message: "Users sorted in descending order", sortedUsers });
//     }


//     return res.status(400).json({ success: false, message: "Invalid order parameter" });
// });









const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    try {

        if (!email&&!password ) {
            return res.json({status:400, sucess: false, message: "Please provide email and password " })
        }



        if (!email ) {
            return res.json({status:401, sucess: false, message: "Please provide email " })
        }

        if (!password) {
            return res.json({status:402, sucess: false, message: "Please provide password" })
        }


        const user = await Users.findOne({ email })

        if (!user) {
            return  res.json({status:403, sucess: false, message: "User does not exist" })
        }
        
        const checkPassword = await user.isCorrectPassword(password)

        if (!checkPassword) {
            return res.json({status:404, sucess: false, message: "Incorrect Password" })
        }

        const newuser = await Users.findById(user._id)

        const token = newuser.generateToken(newuser._id)

        const refereshtoken = newuser.generateRefreshToken(newuser._id)

        newuser.refreshtoken = refereshtoken

        await newuser.save({ validateBeforeSave: false })

        const logedinuser = await Users.findById(newuser._id)


        const options = {
            httpOnly: true,
            secure: true
        };

        res.cookie('token', token, options);
        res.cookie('refreshToken', refereshtoken, options);

        return res.json({
            status:201,
            success: true,
            message: "User login successful",
            logedinuser,
            
        });

    }
    catch (error) {
        console.error("Error:", error);
        return res.json({ status:500, success: false, message: "Internal server error" });
    }
})


const logoutUser = asyncHandler(async (req, res) => {
    try {
        console.log("req.user._id", req.user)

        const id = req.user._id;

        const user = await Users.findByIdAndUpdate(id, {
            $set: {
                refreshtoken: ""
            }
        }, { new: true })

        return res.clearCookie("token").clearCookie("refereshtoken")
            .json({ status:201,sucess: true, message: "user logout succesfull" })
    }
    catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });
    }


})



const resetPassword = asyncHandler(async (req, res) => {

    try {
        const id = req.user._id.toString();
        

        const user = await Users.findById(id)
        const { oldpassword, newpassword, confirmpassword } = req.body
        console.log("oldpassword, newpassword, confirmpassword", oldpassword, newpassword, confirmpassword)
        const checkPassword = await user.isCorrectPassword(oldpassword)
        if (!true === checkPassword) {
            return res.json({status:400, sucess: false, message: "old password is incorrect" })
        }
        if (newpassword === confirmpassword) {
            user.password = newpassword;

            await user.save({ validateBeforeSave: false })
            return res.json({ status:201,sucess: true, message: "password changed successfully" })
        }
        else {
            return res.json({status:401, sucess: false, message: "new password and confirm password is not same" })
        }
    }
    catch (error) {
        console.error("Error:", error);
        return res.json({ status:500, success: false, message: "Internal server error" });
    }

})








const updateUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const userId = req.user._id;
   
    let avatarFilePath = '';
    let bannerFilePath = '';

    try {
        // Check if the email is already in use by another user
        const existingUser = await Users.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            return res.json({status:400, success: false, message: "Email is already in use by another user" });
        }

        // Find the user by ID
        const user = await Users.findById(userId);
        if (!user) {
            return res.json({status:401, success: false, message: "User not found" });
        }

        
        if (req.files && req.files.avatar) {
            avatarFilePath = req.files.avatar[0].filename;
            if (user.avatar && fs.existsSync(path.join("public/images", user.avatar))) {
                fs.unlink(path.join("public/images", user.avatar), (err) => {
                    if (err) {
                        console.error(`Error deleting avatar file: ${err.message}`);
                    }
                });
            }
        }

        if (req.files && req.files.banner) {
            bannerFilePath = req.files.banner[0].filename;
            if (user.coverImage && fs.existsSync(path.join("public/images", user.coverImage))) {
                fs.unlink(path.join("public/images", user.coverImage), (err) => {
                    if (err) {
                        console.error(`Error deleting banner file: ${err.message}`);
                    }
                });
            }
        }

        // Update user information
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            {
                $set: {
                    firstName,
                    lastName,
                    email,
                    avatar: avatarFilePath || user.avatar, // Keep old avatar if not updated
                    coverImage: bannerFilePath || user.coverImage, // Keep old banner if not updated
                },
            },
            { new: true }
        );

        return res.json({status:201, success: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.json({ status:500, success: false, message: "Internal server error" });
    }
});







// const updateavatar = asyncHandler(async (req, res) => {
//     const id = req.user._id

//     const avatarLocalFilePath = req.file?.avatar[0]?.path;
//     if (!avatarLocalFilePath) {
//         return res.status(400).json({ sucess: false, error: "Profile picture  not found" });
//     }



//     const profilePicture = await uploadtAtCloudinary(avatarLocalFilePath);


//     const user = await Users.findByIdAndUpdate(id, {
//         $set: {
//             avatar: profilePicture


//         }
//     }, { new: true })


//     return res.status(201).json({ sucess: true, message: "avatar updated succesfully", user });
// })




const deleteUserById = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;

        if (!validateId(id)) {
            return res.json({status:501, success: false, message: "Invalid ID" });
        }

        const user = await Users.findByIdAndDelete(id);
        if (!user) {
            return res.json({status:400, success: false, message: "User not found" });
        }

        return res.json({ status:201,success: true, message: "User deleted successfully" });
    } catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });
    }
});


const userCount = asyncHandler(async (req, res) => {
    try {
        const totalCount = await Users.countDocuments({ role: 'User' });
        res.json({ status:201,sucess: true, message: "total users", totalUser: totalCount });
    } catch (error) {
        res.status(500).json({ sucess: true, message: "Internal Server Error" });
    }

})

export { registerUser, loginUser, allUsers, logoutUser, updateUser, deleteUserById, resetPassword, userCount, getProfile }