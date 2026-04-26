import blog from "@/models/blog"

import User from '@/models/Users'
import { cookies } from "next/headers";
import { verifyToken } from "../../../lib/jwt";
import { connectDB } from "../../../lib/db";

export async function GET(req, context) {
  try {
    await connectDB();

    const { category } = await context.params
    const cookiStore = await cookies()
    const token = await cookiStore.get("token")?.value
    if (!token) {
      return Response.json({ success: false, message: "Login Again" }, { status: 401 })
    }
    const verifyData = verifyToken(token)
    if (!verifyData) {
      return Response.json({ success: false, message: "Login Again" }, { status: 401 })
    }
    const randomBlog = await blog.aggregate([
      { $sample: { size: 1 } },
      {
        $lookup: {
          from: "blogusers",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy"
        }
      },
      {
        $unwind: "$createdBy"
      }
    ]);
    const blogs = await blog.find({}).populate("createdBy").sort({ createdAt: -1 });;

    const formattedBlogs = blogs.map((b) => ({
      ...b._doc,
      createdAtFormatted: returnDate(b.createdAt)
    }))



    if (blogs.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Not Found",
        },
        { status: 404 }
      );
    }

    const filterBlog = formattedBlogs.filter((item) => {
      if (category === "null") return true;

      let tags = item?.tags;

      if (Array.isArray(tags)) {
        tags = tags.flatMap(tag => tag.split(","));
      } else if (typeof tags === "string") {
        tags = tags.split(",");
      }

      return tags
        .map(tag => tag.trim().toLowerCase())
        .includes(category.toLowerCase());
    });

    return Response.json(
      {
        success: true,
        message: "Found",
        blogs: filterBlog,
        randomBlog,
        date: returnDate(randomBlog[0].createdAt),
      },
      { status: 200 }
    );

  } catch (e) {
    return Response.json(
      {
        success: false,
        message: e.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}

function returnDate(dbdate) {
  return new Date(dbdate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}






















// import { connectDB } from "@/app/api/lib/db";
// import Blog from "@/models/blog";

// export async function GET(req) {
//   await connectDB();

// const { searchParams } = new URL(req.url);
// const page = Number(searchParams.get("page")) || 1;
// const limit = 5;

// const skip = (page - 1) * limit;

// const blogs = await Blog.find()
//   .sort({ createdAt: -1 })
//   .skip(skip)
//   .limit(limit);

// const total = await Blog.countDocuments();

// return Response.json({
//   blogs,
//   nextPage: skip + limit < total ? page + 1 : null,
// });
// }