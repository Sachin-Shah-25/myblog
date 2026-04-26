import User from "@/models/Users";
import { connectDB } from "../../lib/db";
import { generateToken } from "../../lib/jwt";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
export async function POST(req) {
    try {
        const cookieStore = await cookies()
        await connectDB();
        const {myEmail,myPass} = await req.json();

        const existingUser = await User.findOne({ email: myEmail })
        if (!existingUser) {
            return Response.json(
                { success: false, message: "Email not registered" },
                { status: 404 }
            );
        }
        const hasPassword = await bcrypt.hash(myPass, 10)
       
        const getToken = generateToken(existingUser)

        existingUser.password=hasPassword
        await existingUser.save()

        cookieStore.set("token", getToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 24 * 3,
            path: "/",
        });
        return Response.json({
            success: true, message: "Sign In Again" },{status:200})
    }
    catch (e) {
        return Response.json(
            {
                success: false,
                message: e.message || "Something went wrong"
            },
            {
                status: 500
            }
        );
    }
}