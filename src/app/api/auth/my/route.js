import { cookies } from "next/headers";
import { verifyToken } from "../../lib/jwt";
import user from "@/models/Users"
export async function GET(req) {
    const getCookieAccess = await cookies()
      const getToken = getCookieAccess.get("token")?.value;
    if (!getToken) {
        return Response.json({ success: false, message: "Login Again" },{status:401})
    }
    const verifyData = verifyToken(getToken)
    if (!verifyData) {
        return Response.json({ success: false, message: "Login Again" },{status:401})
    }
    const findUser=await user.findOne({_id:verifyData.id})
    if (!findUser) {
        return Response.json({ success: false, message: "Login Again" },{status:401})
    }
    const userData={...verifyData,userImage:findUser.userImage}
    
    return Response.json({
        success: true, message: "", data: {
            ...userData
        }
    })

}