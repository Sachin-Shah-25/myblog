import User from "@/models/Users";
import { connectDB } from "../../lib/db";
import { generateToken } from "../../lib/jwt";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
export async function POST(req) {
    try {
        const cookieStore = await cookies()
        await connectDB();
        const userdata = await req.json();

        const existingUser = await User.findOne({ email: userdata.email })
        if (!existingUser) {
            return Response.json(
                { success: false, message: "Email not registered" },
                { status: 404 }
            );
        }
        const getPass = userdata.password;
        const confirm = await bcrypt.compare(getPass, existingUser.password)
        if (!confirm) {
            return Response.json(
                { success: false, message: "Password doesn't match" },
                { status: 401 }
            );
        }

        const getToken = generateToken(existingUser)

        cookieStore.set("token", getToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 24 * 3,
            path: "/",
        });


        return Response.json({
            success: true, message: "Login Successfully", data: {
                id: existingUser._id,
                name: existingUser.name,
                nickname: existingUser.nickname,
                email: existingUser.email,
                bio: existingUser.bio,
                profile: existingUser.userImage,
            }
        })
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