
import mongoose from "mongoose";

const pressSchema = new mongoose.Schema(
    {

        title: {
            type: String,
            required: true
        },
        newsFile:{
            type: String,
            required: true

        },
        logoFile: {
            type: String,
          

        },

        mediaLink: {
            type: String,
            required: true,

        },
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },



    },
    { timestamps: true }
)
// pressSchema.plugin(mongooseAggregatePaginate)



export const Press = mongoose.model("Press", pressSchema)