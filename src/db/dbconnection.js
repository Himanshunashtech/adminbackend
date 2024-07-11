import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({
    path:"./.env"
})

const dbconnection= async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
      .then(()=>{
        console.log(`database connected`)


      }).catch((error)=>{
        console.log("ERROR",error) 
        
        
      })

    }catch(error){
  console.log("ERROR",error)
    }

    

}
export default dbconnection