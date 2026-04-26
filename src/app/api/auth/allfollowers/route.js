import { cookies } from "next/headers";
import { connectDB } from "../../lib/db";
import { verifyToken } from "../../lib/jwt";
import followsModel from "@/models/follow"
import { NextResponse } from "next/server";
import mongoose from 'mongoose'
import userModel from "@/models/Users"
export async function GET() {
    try {
        await connectDB();
        const getCookieAccess = await cookies()
        const getToken = getCookieAccess.get("token")?.value;
        if (!getToken) {
            return Response.json({ success: false, message: "Login Again" }, { status: 401 })
        }
        const verifyData = verifyToken(getToken)
        if (!verifyData) {
            return Response.json({ success: false, message: "Login Again" }, { status: 401 })
        }
        const userId = verifyData.id
        const myId = userId

        const followingIds = await followsModel
            .find({ followby: myId })
            .distinct("followto")
        const users = await userModel.find({
            _id: { $ne: myId }
        });
        const filterUser = users.map((user) => {
            return {
                ...user._doc,
                nickname: user._doc.nickname || "@" + user._doc.name
            };
        });

        return NextResponse.json({ success: true, data: filterUser }, { status: 201 })
    }
    catch (e) {
        return NextResponse.json({ success: false, message: e.message || "Something went wrong" ,status:500}, { status: 500 })
    }

}