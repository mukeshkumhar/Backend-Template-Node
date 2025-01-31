import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        // required: true,
    },
    coverImage: {
        type: String, // cloudinary url
    },
    channel: {
        type: Boolean,
        default: 0,
    },
    channelName:{
        type: String,
        default: "",
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "UserVideo"
    }],
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    accessToken: {
        type: String,
    },

    refreshToken: {
        type: String,
    }

},
    {
        timestamps: true
    }
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAcessToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            // expiresIn:"1d"
        }
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
            // email: this.email,
            // username: this.username,
            // fullname: this.fullname,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            // expiresIn:"10d"
        }
    )
}

export const User = mongoose.model("User", userSchema)