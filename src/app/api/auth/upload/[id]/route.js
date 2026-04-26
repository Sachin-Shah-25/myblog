import { connectDB } from "@/app/api/lib/db";
import { NextResponse } from "next/server";
import blog from "@/models/blog"
import mongoose from 'mongoose'
export async function PUT(req, context) {
    try {
        await connectDB();
        const { id } = await context.params;
        const getUpdateData = await req.json();
        const title = getUpdateData.title;
        const dis = getUpdateData.dis;
        const {youtube,github,linkedin}=getUpdateData.links

        const findBlog = await blog.findOne({ _id: id })

        if (!findBlog) {
            return NextResponse.json({ success: false, message: "Post not found " }, { status: 409 })
        }

        findBlog.description = dis ? dis : findBlog.description
        findBlog.title = title ? title : findBlog.title
        findBlog.youtube = youtube ? youtube : findBlog.youtube
        findBlog.github = github ? github : findBlog.github
        findBlog.linkedin = linkedin ? linkedin : findBlog.linkedin

        await findBlog.save();

        return NextResponse.json({ success: true, message: "" }, { status: 200 })

    } catch (e) {
        return NextResponse.json({ success: false, message: e.message || "Something went wrong" }, { status: 500 })
    }
}

export async function DELETE(req, context) {
    try {
        await connectDB();
        const { id } = await context.params;

        const mongoID=new mongoose.Types.ObjectId(id)
        
        const isDeleted=await blog.findByIdAndDelete(mongoID);
        if (!isDeleted) {
            return NextResponse.json({ success: false, message: "Post not found " }, { status: 409 })
        }

        return NextResponse.json({ success: true, message: "Deleted" }, { status: 200 })

    } catch (e) {
        return NextResponse.json({ success: false, message: e.message || "Something went wrong" }, { status: 500 })
    }
}