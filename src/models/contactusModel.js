import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
       
        email: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        }



    },{
        timestamps: true
    }
)

const Contactus = mongoose.model("Contactus",contactSchema)

export default Contactus;