import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import Jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import cookieParser from "cookie-parser"


const verifyJWT = asyncHandler(async (req, _, next) => {
    try {


        const token = req.cookies?.accessToken || req.headers
            ("Authorization")?.replace("Bearer ", "").trim();

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        // console.log("Token:->", token)

        const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -accessToken -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        console.log("JWT verify")
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid access Token in auth.middleware.js -> " + error?.message)
    }

})



export{verifyJWT}