import user from "@/models/Users";
import blogs from "@/models/blog";
import comments from "@/models/comment";
import follower from "@/models/follow";
import likes from "@/models/like";
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "../../../lib/jwt";
export async function GET(req, context) {
    try {
        await connectDB()
        const { id } = await context.params;
        const userId = id
        const myData = await user.findOne({ _id: userId }).select("-password");

        const myBlogs = await blogs
            .find({ createdBy: myData._id })
            .sort({ createdAt: -1 });

        const followersCount = await follower.countDocuments({
            followto: myData._id,
        });

        const followingCount = await follower.countDocuments({
            followby: myData._id,
        });

        const totalLikes = await likes.countDocuments({
            userId: myData._id,
        });

        return NextResponse.json({
            success: true,
            data: {
                user: myData,
                blogs: myBlogs,
                stats: {
                    followers: followersCount,
                    following: followingCount,
                    posts: myBlogs.length,
                    likes: totalLikes,
                },
            },
        });
    } catch (e) {
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}