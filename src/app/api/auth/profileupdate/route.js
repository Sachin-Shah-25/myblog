import fs from "fs/promises"
import path from "path"
import blog from "@/models/blog"
import user from "@/models/Users"
import { connectDB } from "../../lib/db"
export async function POST(req) {
    try {
        await connectDB()
        const formData = await req.formData()
        const bio = formData.get("bio")
        const imageFile = formData.get("myimage")
        const userid = formData.get("userid")
        const nickname = formData.get("nickname")
        const youtube = formData.get("youtube")
        const github = formData.get("github")
        const linkedin = formData.get("linkedin")
        var fileName = null;


        const findUser = await user.findById(userid)

        if (!findUser) {
            return Response.json(
                { success: false, message: "Please login again" },
                { status: 401 }
            )
        }

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const ext = imageFile.name?.split(".").pop() || "png"
            fileName = `${Date.now()}.${ext}`

            const uploadDir = path.join(process.cwd(), "public/profile")
            await fs.mkdir(uploadDir, { recursive: true })

            const filePath = path.join(uploadDir, fileName)
            await fs.writeFile(filePath, buffer)

            try {
                const filePath = path.join(
                    process.cwd(),
                    "public/profile",
                    findUser.userImage
                )

                await fs.unlink(filePath)
            } catch (e) {
                console.log("")

            }
        }

        findUser.userImage = fileName || findUser.userImage
        findUser.bio = bio || findUser.bio

        findUser.nickname = nickname
            ? nickname.startsWith("@")
                ? nickname
                : "@" + nickname
            : findUser.nickname

        findUser.youtube = youtube || findUser.youtube
        findUser.github = github || findUser.github
        findUser.linkedin = linkedin || findUser.linkedin

        await findUser.save()

        return Response.json(
            { success: true, message: "Profile updated successfully", data: findUser },
            { status: 200 }
        )

    } catch (e) {
        return Response.json(
            { success: false, message: e.message || "Something went wrong" },
            { status: 500 }
        )
    }
}