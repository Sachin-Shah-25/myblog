import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'
export async function POST(req) {
    try {
        const { getEmail } = await req.json()
        const createTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASSWORD,
            }
        })
        const getOtp=generateOTP()
        console.log("get OTP ",getOtp)
        const isMailSended = await createTransport.sendMail({
            from: process.env.EMAIL_USER,
            to: getEmail,
            subject: "DevBlog OTP Verification",
            html: `<h2>DevBlog</h2>
         <p>Your OTP is <b>483921</b></p>
         <p>Valid for 5 minutes</p>`
        })

        if (!isMailSended) {
            return NextResponse.json({ success: false, message: e.message || "Something went wrong " }, { status: 500 })
        }
        return NextResponse.json({ success: true, message: "Sended", Otp: getOtp }, { status: 201 })
    } catch (e) {
        return NextResponse.json({ success: false, message: e.message || "Something went wrong " }, { status: 500 })
    }
}


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}