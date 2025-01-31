import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { DeleteVideo, UploadVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router()

router.route("/upload-video").post(verifyJWT,upload.fields(
    [
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnailFile",
            maxCount: 1,
        }
    ]
), UploadVideo) 

router.route("/delete-video").post(verifyJWT,DeleteVideo)

export default router