import { Router } from "express"
const pressRouter = Router()
import { mediaHandler, upload } from "../middlewares/multer.js"

import { updatemedialink, uploadMedia ,deleteitem, getmediaLinks} from "../controllers/pressmanagementController.js"
import { AdminAuth } from "../utils/adminAuth.js"
import { auth } from "../middlewares/auth.js"





// pressRouter.post("/uploadimage", upload.fields([
//     {
//         name: "imageFile",
//         maxCount: 1
//     }]),imagehandler
// )

// router.post("/updateuser" , mediaHandler().array("avatar",2),auth ,updateUser )
pressRouter.get("/get_all_news",auth,AdminAuth,getmediaLinks)
pressRouter.post(
    "/upload_news",
    auth,
    AdminAuth,
    mediaHandler().fields([{ name: 'news', maxCount: 2 }, { name: 'logo', maxCount: 1 }]),
    uploadMedia
  );
  pressRouter.put("/update_news_img",updatemedialink)
pressRouter.delete("/delete_news/:id",deleteitem)



export default pressRouter