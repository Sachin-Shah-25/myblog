import mongoose from "mongoose"


const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    nickname: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    userImage: {
        type: String,
        default: "",
    },
    youtube: {
        type: String,
    },
    github: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 200,
        default: "bio....",
    },
}, { timestamps: true })



export default mongoose.models.blogusers || mongoose.model("blogusers", userschema)







