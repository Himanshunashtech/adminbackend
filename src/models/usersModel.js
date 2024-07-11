import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import Joi from "joi";

const key = "1234567";

const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
const userSchemaJoi = Joi.object({
    _id:Joi.required(),
    // __v:Joi.required(),
    firstName: Joi.string().required().trim().lowercase(),
    lastName: Joi.string().required().trim().lowercase(),
    email: Joi.string().email().required(),
    // avatar: Joi.string().optional(),
    // coverImage: Joi.string().optional(),
    role: Joi.string().optional(),
    password: Joi.string()
        .required()
        .pattern(passwordPattern)
        .messages({
            'string.pattern.base': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
        }),
    refreshtoken: Joi.string().optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
});

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: {
            type: String, 
        },
        coverImage: {
            type: String,
        },
        role: {
            type: String,
            required: true,
            default: "User"
        },
        password: {
            type: String,
            required: true,
        },
        refreshtoken: {
            type: String,
        },
    },
    
    { timestamps: true,
        versionKey: false,
     }
);

userSchema.pre("save", async function (next) {
    try {
        // Validate the user object using Joi
        await userSchemaJoi.validateAsync(this.toObject(), { abortEarly: false });

        // Hash the password if it's modified
        if (this.isModified("password")) {
            this.password = await bcryptjs.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isCorrectPassword = function (password) {
    return bcryptjs.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
        },
        process.env.KEY,
        { expiresIn: process.env.TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
    process.env.KEY,
        { expiresIn: process.env.TOKEN_EXPIRY }
    );
};

export const Users = mongoose.model("Users", userSchema);
