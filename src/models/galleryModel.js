import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const gallerySchema = new mongoose.Schema(
    {
        assets:[{
            type:String,
            
        }],
        
        title:{
            type:String,
           
        },
        // imageFile:{
        //     type:String,
            
        // },
        //value 0 for gallery management and 1 for press management
     
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'  
        },

        //0 for video 1 for images
        type:{
            type:Number,
            required:true,
            
        }

    },
    {timestamps:true}
)
 gallerySchema.plugin(mongooseAggregatePaginate)



export const Gallery = mongoose.model("Gallery",gallerySchema)