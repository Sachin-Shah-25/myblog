import User from "@/models/Users";
import { connectDB } from "../../lib/db";
import { generateToken } from "../../lib/jwt";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
export async function POST(req) {
    try {
        await connectDB();
        const {email} = await req.json();
        
        const existingUser = await User.findOne({ email: email })
        if (!existingUser) {
            return Response.json(
                { success: false, message: "Email not registered" },
                { status: 404 }
            );
        }

        return Response.json({
            success: true, message: "Email",
        }, { status: 200 })
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