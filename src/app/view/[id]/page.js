"use client"
import { useContext, useState, useOptimistic, setTransition, useEffect, useMemo, useCallback } from "react";
import FullScreenLoader from "@/components/Extra/FullScreenLoader";
import { AppContext } from "@/Context/AppContext";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CommentSection from "@/components/View/CommentSection";
import { fetchUser } from "@/app/api/lib/api";
import Link from "next/link";
import FollowCard from "@/components/View/FollowCard";
import FormatTime from "@/components/Extra/FormatTime";
import IconsComp from "@/components/IconsComp";
export default function PostPage() {
    const queryClient = useQueryClient()
    const [userLike, setUserLike] = useState(false)
    const [totalComment, setTotalComment] = useState(0)
    const router = useRouter()
    const { id } = useParams()
    const userdata = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: true

    })

    const { data, isPending, error } = useQuery({
        queryKey: ["view", id],
        queryFn: async () => {
            const res = await fetch(`/api/auth/view/${id}`, {
                method: "GET",
                credentials: "include"
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.message || "Something went wrong")
            }

            return result
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: true
    })

    console.log(data)

    const updateLike = async () => {

        try {
            const likeddet = {
                likeby: userdata.data.id,
                postid: data.blog._id
            }


            const res = await fetch("/api/auth/like", {
                method: "POST",
                body: JSON.stringify(likeddet),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.message || "Something went wrong")
            }




        } catch (e) {
            console.log("Like error:", e.message)
        }
    }


    const isHasLiked = useMemo(() => {
        if (!data?.likes) {
            return { totallikes: 0, like: false }
        }
        const likes = data.likes.map(item => item.likeby)
        const isAlreadyLiked = likes.includes(userdata?.data?.id)
        return {
            totallikes: likes.length > 0 ? likes.length : 0,
            like: isAlreadyLiked && isAlreadyLiked
        };
    }, [data?.likes, userdata?.data?.id])

   
    const udpateComment = useCallback((len) => {
        setTotalComment(len + 1)
        queryClient.invalidateQueries({ queryKey: ["user"] })
    }, [])
    useEffect(() => {
        if (!data) return
        setTotalComment(data.blog.comments.length)
    }, [data])

    if (isPending || userdata.isPending) {
        return <FullScreenLoader></FullScreenLoader>
    }
    if (error) {

        if (error.message.includes("Login Again")) {
            router.push("/signin")
        }
    }
    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col lg:flex-row gap-8 lg:gap-10">

            <div className="w-full min-w-0">

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                    {data && data.blog && data.blog.title}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                    <img
                        src={
                            data
                                ? (data.blog.createdBy.userImage ? `/profile/${data.blog.createdBy.userImage}` : "/image/image.png")
                                : "/image/image.png"
                        }
                        alt="author"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-medium">{data && data.blog.createdBy.name}</p>
                        <p className="text-sm w-full text-end text-gray-500">
                            {FormatTime(data && data.blog.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] mb-8">
                    <img
                        src={
                            data
                                ? (data.blog.image ? `/image/${data.blog.image}` : "/image/blog1.png")
                                : "/image/blog1.png"
                        }
                        alt="blog"
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>

                <div className="max-w-none text-gray-800 leading-7">

                    <p className="mb-4 font-semibold text-gray-800 border rounded-xl p-4 bg-gray-600 text-white text-base text-sm sm:text-lg" style={{fontSize:"14px"}}>
                        {data && data.blog.description}
                         
                        <IconsComp 
                            youtube={data.blog?.youtube || "#"}
                            linkedin={data.blog?.linkedin || "#"}
                            github={data.blog?.github || "#"}  >
                        </IconsComp>
                    </p>

                    <h2 className="text-xl mt-8 sm:text-2xl font-semibold mt-8 mb-3">
                        1. Practice Daily
                    </h2>
                    <p className="mb-4 text-base sm:text-lg text-gray-700">
                        The more you code, the better you get. Consistency is key.
                    </p>

                    <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-3">
                        2. Build Projects
                    </h2>
                    <p className="mb-4 text-base sm:text-lg text-gray-700">
                        Apply what you learn by building real-world projects.
                    </p>

                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6 bg-gray-100 py-2">
                        "Learning by doing is the fastest way to master JavaScript."
                    </blockquote>

                    <p className="text-base sm:text-lg text-gray-700">
                        Keep exploring, experimenting, and improving your skills.
                    </p>

                </div>

                <div className="flex gap-3 mt-8 flex-wrap">
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                        JavaScript
                    </span>
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                        Tips
                    </span>
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                        Learning
                    </span>
                </div>

                <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 text-gray-600">
                    <button onClick={() => updateLike()} className={`cursor-pointer ${isHasLiked.like ? "text-blue-700" : "text-black"} font-semibold hover:text-blue-700`}>
                        {isHasLiked.totallikes} Like 👍
                    </button>
                    <span>.</span>
                    <button className="hover:text-black font-semibold">🔖 Bookmark</button>
                    <span>.</span>
                    <button className="hover:text-black font-semibold">{totalComment} Comments 💬</button>
                </div>

                <CommentSection
                    comment={data && data.comments}
                    postid={data && data.blog._id}
                    udpateComment={udpateComment}
                    user={userdata.data && userdata.data}
                />

            </div>

            <FollowCard data={data} userdata={userdata} />

        </div>
    );
}
