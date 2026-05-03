import { connectDB } from "../../lib/db"
import commentmodel from "@/models/comment"
import blog from "@/models/blog"

export async function POST(req) {
    try {
        console.log("a")
        await connectDB()
        
        console.log("b")
        const getData = await req.json()
        
        console.log("c")
        if (!getData.comment || !getData.postid || !getData.commentby) {
            return Response.json(
                { success: false, message: "Missing fields" },
                { status: 400 }
            )
        }
        
        console.log("d")
        const isCommentCreated = await commentmodel.create({
            comment: getData.comment,
            postid: getData.postid,
            commentby: getData.commentby
        });
        console.log("e ",isCommentCreated)

        // const findBlog = await blog.findOne({ _id: getData.postid })
        if (!isCommentCreated) {
            return Response.json(
                { success: false, message: "Not Added Comment" },
                { status: 404 }
            )
        }
        // findBlog.comments.push(isCommentCreated._id)

        // await findBlog.save()

        return Response.json(
            { success: true, message: "Comment created" },
            { status: 201 }
        )

    } catch (e) {

        return Response.json(
            { success: false, message: e.message || "Something went wrong" },
            { status: 500 }
        )
    }
}