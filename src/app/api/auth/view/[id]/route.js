import { connectDB } from "@/app/api/lib/db";
import Blog from "@/models/blog";
import "@/models/Users"
import "@/models/comment"
import like from "@/models/like"
import { cookies } from "next/headers";
import { verifyToken } from "@/app/api/lib/jwt";
import followmodel from "@/models/follow"
import commentModel from "@/models/comment"

export async function GET(req, context) {
    try {
        await connectDB()
        const { id } = await context.params;

        const getCookieAccess = await cookies()
        const getToken = getCookieAccess.get("token")?.value;
        if (!getToken) {
            return Response.json({ success: false, message: "Login Again" }, { status: 401 })
        }

        const verifyData = verifyToken(getToken)
        if (!verifyData) {
            return Response.json({ success: false, message: "Login Again" }, { status: 401 })
        }

        const blog = await Blog.findOne({ _id: id }).populate("createdBy")

        if (!blog) {
            return Response.json({ success: false, message: "Not Found" }, { status: 404 })
        }

        const allComments = await commentModel.find({ postid: id }).populate("commentby").populate("parentcomment")

        const commentMap = {};
        const roots = [];

        allComments.forEach(c => {
            commentMap[c._id] = { ...c.toObject(), replies: [] };
        });

        allComments.forEach(c => {
            if (c.parentcomment) {
                commentMap[c.parentcomment._id]?.replies.push(commentMap[c._id]);
            } else {
                roots.push(commentMap[c._id]);
            }
        });

        const userId = verifyData.id
        const createdById = blog.createdBy._id

        const isCheck = await followmodel.findOne({
            followby: userId,
            followto: createdById
        })

        const getAllLikes = await like.find({ postid: blog._id })

        return Response.json(
            {
                success: true,
                message: "Found",
                blog,
                comments: roots,
                likes: getAllLikes.length > 0 ? getAllLikes : [],
                followed: isCheck != null ? true : false
            },
            { status: 200 }
        );

    } catch (e) {
        return Response.json(
            {
                success: false,
                message: e.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}