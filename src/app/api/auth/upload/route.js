import fs from "fs/promises"
import path from "path"
import blog from "@/models/blog"
import { connectDB } from "../../lib/db"
export async function POST(req) {

    try {
        await connectDB();
        const formData = await req.formData()
        const title = formData.get("title")
        const description = formData.get("description")
        const imageFile = formData.get("imagefile")
        const tags = formData.getAll("tags")
        const userid = formData.get("userid")
        const youtube = formData.get("youtube")
        const github = formData.get("github")
        const linkedin = formData.get("linkedin")

        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        const ext = imageFile.name.split(".").pop()
        
        const fileName = `${Date.now()}.${ext}`
        const filePath = path.join(process.cwd(), "public/image", fileName)
        await fs.writeFile(filePath, buffer)
        
        const createdBlog  = await blog.create({
            title,
            description,
            image: fileName,
            createdBy: userid ,
            tags  ,
            youtube,
            github,
            linkedin
        });
        
        if (!createdBlog ) {
            return Response.json(
                { success: false, message: "Something went wrong" },
                { status: 401 })
            }
        return Response.json(
            { success: true, message: "Added, Leti's View..." ,data:createdBlog.title},
             { status: 200 })


    } catch (e) {
        return Response.json(
            { success: false, message: e.message || "Something went wrong" }, { status: 500 })
    }

}