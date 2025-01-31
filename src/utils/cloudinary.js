import { v2 as cloudinary } from 'cloudinary';

import fs from "fs"

// (async function () {

// Configuration


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary successfully:", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        console.log("Error while uploading image on cloudinary:", error);
        fs.unlinkSync(localFilePath) // removed the locally saved file
    }
}

const uploadOnCloudinaryVideo = async (localFilePath)=> {
    try {
        if(!localFilePath) return null 
        const response = await cloudinary.uploader.upload(localFilePath,{

            resource_type: "video"

        })

        console.log("file is uploaded on cloudinary successfully:", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        console.log("Error when uploading video on cloudinary in utils folder -> ", error);
        fs.unlinkSync(localFilePath) // removed the locally saved file
    }
}

const deleteVideoFromCloudinary = async(videoLink)=>{
    try {

        // Extract public_id from the URL
        const publicId = videoLink.split('/').pop().split('.')[0]; // e.g., mcttrobdbtahynbb8efl

        // Check if the video exists
        const videoAvailable = await cloudinary.api.resource(publicId, { resource_type: 'video' });
        console.log('Video exists:', videoAvailable);

        // Delete the video
        const deleteResponse = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        console.log('Video is deleted from cloudinary successfully:', deleteResponse);

    } catch (error) {
        if (error.http_code === 404) {
            console.log('Video does not exist.');
        } else {
            console.error('Video was not deleted -> ', error);
        }
    }
}

const deleteImageFromCloudinary = async(imageLink) => {
    try {
        // Extract public_id from the URL
        const publicId = imageLink.split('/').pop().split('.')[0]; 

        // Check if the video exists
        const imageAvailable = await cloudinary.api.resource(publicId, { resource_type: "image" });
        console.log('Image exists:', imageAvailable);

        // Delete the video
        const deleteResponse = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        console.log('Image is deleted from cloudinary successfully:', deleteResponse);
    } catch (error) {
        if (error.http_code === 404) {
            console.log('Image does not exist.');
        } else {
            console.error('Image was not deleted -> ', error);
        }
    }
}


export { uploadOnCloudinary, uploadOnCloudinaryVideo, deleteVideoFromCloudinary, deleteImageFromCloudinary }



// // Upload an image
// const uploadResult = await cloudinary.uploader
//     .upload(
//         'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//         public_id: 'shoes',
//     }
//     )
//     .catch((error) => {
//         console.log(error);
//     });

// console.log(uploadResult);
// })();