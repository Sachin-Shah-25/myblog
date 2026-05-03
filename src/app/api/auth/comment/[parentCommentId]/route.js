import { connectDB } from "@/app/api/lib/db";
import { NextResponse } from "next/server";
import blog from "@/models/blog"
import Comment from "@/models/comment"
import { cookies } from "next/headers";
import { verifyToken } from "@/app/api/lib/jwt";

export async function POST(req, context) {

    try {
        await connectDB();
        const { parentCommentId } = await context.params;

        const getData = await req.json();
        const comment = getData.comment;
        const postid = getData.postid;
        const commentby = getData.commentby;

        const findPost = await blog.findOne({ _id: postid });

        if (!findPost) {
            return NextResponse.json({ success: false, message: "Post Deleted" }, { status: 404 })
        }

        const isCommentSaved = await Comment.create({ comment, postid, commentby, parentcomment:parentCommentId })

        if (!isCommentSaved) return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 409 })

        return NextResponse.json({ success: true, message: "" }, { status: 200 })
        
        
    } catch (e) {
        return NextResponse.json({ success: false, message: "Interval Server Error " }, { status: 500 })
    }
}

export async function DELETE(req, context) {
    try {
        await connectDB();
        const { parentCommentId } = await context.params; 
        
        const getCookieAccess = await cookies();
        const getToken = getCookieAccess.get("token")?.value;
        if (!getToken) {
            return Response.json({ success: false, message: "Login Again" }, { status: 401 });
        }
        
        const verifyData = verifyToken(getToken);
        if (!verifyData) {
            return Response.json({ success: false, message: "Login Again" }, { status: 401 });
        }
        const comment = await Comment.findOne({_id:parentCommentId});
        if (!comment) {
            return Response.json({ success: false, message: "Comment not found" }, { status: 404 });
        }

        if (comment.commentby.toString() !== verifyData.id) {
            return Response.json({ success: false, message: "Not authorized" }, { status: 403 });
        }
        
        const deleteCommentAndReplies = async (commentId) => {
            const replies = await Comment.find({ parentcomment: commentId });
            
            for (const reply of replies) {
                await deleteCommentAndReplies(reply._id);
            }
            
            await Comment.findByIdAndDelete(commentId);
        };
        
        await deleteCommentAndReplies(parentCommentId);

        return Response.json(
            { success: true, message: "Comment deleted successfully" },
            { status: 200 }
        );

    } catch (e) {
        return Response.json(
            { success: false, message: e.message || "Something went wrong" },
            { status: 500 }
        );
    }
}