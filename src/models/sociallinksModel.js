import mongoose from "mongoose";

const linksSchema = new mongoose.Schema({
     title:{
        type:String,
        required:true
     },
     url:{
        type:String,
        required:true,
        unique:true
     },
     creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'  
  },
 

}
, { timestamps: true })

const SocialLinks = mongoose.model("SocialLinks",linksSchema)

export default SocialLinks

