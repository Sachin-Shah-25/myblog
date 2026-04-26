import User from '@/models/Users'
import { connectDB } from '../../lib/db';
import bcrypt from 'bcryptjs'
import { generateToken } from '../../lib/jwt';
import { cookies } from 'next/headers';
export async function POST(req) {
    try {
        await connectDB();
        const userdata = await req.json();

        const existingUser = await User.findOne({ email: userdata.email })
        if (existingUser) {
            return Response.json(
                { success: false, message: "User already exists" }, { status: 404 })
        }
        const getPass = userdata.password;
        const hasPassword = await bcrypt.hash(getPass, 10)

        const userDet = { ...userdata, nickname: `@${userdata.name}` }
        const user = await User.create({
            ...userDet,
            password: hasPassword,
        })
        return Response.json({ success: true, message: "AccountCreated!" })
    }
    catch (e) {

        return Response.json(
            { success: false, message: e.message || "Something went wrong" }, { status: 500 })
    }
}

