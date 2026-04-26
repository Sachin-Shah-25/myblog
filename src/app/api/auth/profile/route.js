import user from "@/models/Users";
import blogs from "@/models/blog";
import comments from "@/models/comment";
import follower from "@/models/follow";
import likes from "@/models/like";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "../../lib/jwt";
export async function GET() {
    try {
        await connectDB()
        const getCookieAccess = await cookies()
        const getToken = getCookieAccess.get("token")?.value;
        if (!getToken) {
            return Response.json({ success: false, message: "Login Again" }, { status: 401 })
        }
        const verifyData = verifyToken(getToken)
        if (!verifyData) {
            return Response.json({ success: false, message: "Login Again" }, { status: 401 })
        }



        const userId = verifyData.id
        const myData = await user.findOne({ _id: userId }).select("-password");

        const myBlogs = await blogs
            .find({ createdBy: myData._id })
            .sort({ createdAt: -1 });

        const followersCount = await follower.find({
           followby: myData._id,
        }).populate("followto");
       
        const filterFollowersToUser = followersCount.map((item) => {
            const user = item.followto;
          
            return {
                ...user._doc,
                nickname: user._doc.nickname || "@" + user._doc.name
            };
        });

        const followingCount = await follower.find({
            followto: myData._id,
        }).populate("followby");

        const filterFollowingByUser = followingCount.map((item) => {
            const user = item.followby;
            return {
                ...user._doc,
                nickname: user._doc.nickname || "@" + user._doc.name
            };
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

                    following: filterFollowersToUser,
                    followers: filterFollowingByUser,
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