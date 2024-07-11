const asyncHandler =(requestHandler)=>{
 return async (req, res ,next)=>{
    await requestHandler(req,res,next).catch((error)=>{
        console.log("Error",error)
    })
 }
}

export {asyncHandler}
