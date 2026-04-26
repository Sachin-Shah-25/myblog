import Follow from "@/models/follow"
import { connectDB } from "../../lib/db"

export async function POST(req) {
  try {
    await connectDB()
  
    const { followby, followto } = await req.json()

    if (!followby || !followto) {
      return Response.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      )
    }

    if (followby === followto) {
      return Response.json(
        { success: false, message: "You cannot follow yourself" },
        { status: 400 }
      )
    }

    const alreadyFollowed = await Follow.findOne({
      followby,
      followto
    })

    if (alreadyFollowed) {
      return Response.json(
        { success: false, message: "Already followed" },
        { status: 400 }
      )
    }

    const newFollow = await Follow.create({
      followby,
      followto
    })

    return Response.json(
      {
        success: true,
        message: "Followed successfully",
        data: newFollow
      },
      { status: 201 }
    )

  } catch (e) {
    return Response.json(
      {
        success: false,
        message: e.message || "Something went wrong"
      },
      { status: 500 }
    )
  }
}