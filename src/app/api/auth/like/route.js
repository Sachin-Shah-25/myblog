import { connectDB } from "../../lib/db"
import likemodel from "@/models/like"
import blog from "@/models/blog"
export async function POST(req) {
    try {
        await connectDB();

        const getData = await req.json()
        if (!getData.likeby || !getData.postid) {
            return Response.json(
                { success: false, message: "Missing fields" },
                { status: 400 }
            )
        }

        const alreadyLiked = await likemodel.findOne({
            likeby: getData.likeby,
            postid: getData.postid
        })

        if (alreadyLiked) {
            return Response.json(
                { success: false, message: "Already liked" },
                { status: 400 }
            )
        }

        const isLiked = await likemodel.create({
            likeby: getData.likeby,
            postid: getData.postid
        })

        return Response.json(
            { success: true, message: "Post liked successfully", data: isLiked },
            { status: 201 }
        )

    } catch (e) {
        return Response.json(
            { success: false, message: e.message || "Something went wrong" },
            { status: 500 }
        )
    }
}