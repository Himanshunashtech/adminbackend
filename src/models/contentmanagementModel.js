import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images:[{
        type:String,

    }],
    heading:{
        type: String,
        required: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'  
    }
},
{ timestamps: true });

const Content = mongoose.model("Content", contentSchema);

export default Content;
