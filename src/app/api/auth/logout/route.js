import { connectDB } from "../../lib/db";
import { cookies } from "next/headers";
export async function GET(req) {
    try {
        const cookieStore = await cookies()
        await connectDB();

        cookieStore.delete({
            name: "token",
            path: "/"
        })
       return Response.json({success:true,messge:"Logout ScuccessFully"})
    }
    catch (e) {
        return Response.json({ success: false, message: e.message || "Something went wrong" })
    }
}