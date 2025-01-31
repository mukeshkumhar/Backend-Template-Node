import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImageFromCloudinary, deleteVideoFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { uploadOnCloudinaryVideo } from "../utils/cloudinary.js";





const UploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }



    const videoFilePath = await req.files?.videoFile[0]?.path;
    const thumbnailPath = await req.files?.thumbnailFile[0]?.path;

    if (!videoFilePath) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is required");
    }
    if (!title || !description) {
        throw new ApiError(400, "Title and description is required");
    }



    const videoFile = await uploadOnCloudinaryVideo(videoFilePath)
    const thumbnailFile = await uploadOnCloudinary(thumbnailPath)

    if (!videoFile) {
        throw new ApiError(400, "failed to Upload video on Cloudinary...");

    }
    if (!thumbnailFile) {
        throw new ApiError(400, "failed to Upload thumbnail on Cloudinary...");
    }


    const newVideo = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnailFile.url || "",
        title,
        description,
        owner: user._id,
    });

    const uploadedVideo = await Video.findById(newVideo._id)

    user.videos.push(uploadedVideo._id)
    await user.save();

    return res
        .status(201)
        .json(new ApiResponse(200, { uploadedVideo }, "Video uploaded successfully"))

})

const DeleteVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Video id is required")
    }

    console.log("Video Id: ", videoId)

    

    // console.log(user)
    // const Id = "6758465dd9a01f92b8d82b18"

    const video = await Video.findById(videoId) // problem

    console.log(video)



    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const videoLink = video?.videoFile;
    const thumbnailLink = video?.thumbnail;
    console.log(thumbnailLink)

    await deleteVideoFromCloudinary(videoLink);
    await deleteImageFromCloudinary(thumbnailLink)



    const deletedVideo = await Video.findByIdAndDelete(videoId)

    const response = deletedVideo.title;

    const isDeleted = await Video.findById(deletedVideo._id)

    if(isDeleted){
        throw new ApiError(404, "Failed to Delete Due to Internal server error! ")
    }

    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(404, "User not found");
    }


    const updatedUser = await User.findByIdAndUpdate(
        user._id,                  // The ID of the user to update
        { $pull: { videos: videoId } }, // Remove the videoId from the videos array
        { new: true }            // Return the updated user document
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found" )
    }



    // const videoDeleted = await 
    return res
        .status(200)
        .json(new ApiResponse(200, { response }, "Video deleted successfully"))
})


export { UploadVideo, DeleteVideo };