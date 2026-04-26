import Link from "next/link"
import { useOptimistic, startTransition, useState } from "react"
export default function FollowCard({ data, userdata }) {

    if(!data){
        return;
    }
    const [isFollowing, setIsFollowing] = useState(data.followed)

    const [optimisticFollow, addOptimisticFollow] = useOptimistic(
        isFollowing,
        (prev, next) => next
    )


    const followby = userdata?.data.id
    const followto = data?.blog.createdBy._id

    const handleFollow = async () => {
        const followdet = {
            followby: userdata?.data.id,
            followto: data?.blog.createdBy._id
        }

        startTransition(() => {
            addOptimisticFollow(true)
        })

        try {
            const res = await fetch("/api/auth/follow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(followdet),
                credentials: "include"
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.message)
            }

            setIsFollowing(true)

        } catch (e) {
            console.error(e.message)

            startTransition(() => {
                addOptimisticFollow(false)
            })
        }
    }

    return <div className="w-full lg:w-1/4">
        <div className="lg:sticky lg:top-20">

            {followto != followby && (
                <div className="border border-gray-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <img
                            src={
                                data?.blog.createdBy?.userImage
                                    ? `/profile/${data.blog.createdBy.userImage}`
                                    : `/image/image.png`
                            }
                            className="w-12 h-12 border border-gray-100 rounded-full object-cover"
                            style={{ padding: "2px" }}
                        />
                        <div>
                            <p className="font-semibold">{data && data.blog.createdBy.name}</p>
                            <p className="text-sm text-gray-500">Developer</p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleFollow()}
                        className={`mt-4 w-full text-white py-2 rounded-lg cursor-pointer delay-100 ${optimisticFollow
                                ? "bg-green-500"
                                : "bg-blue-500 hover:bg-blue-400"
                            }`}
                    >
                        {optimisticFollow ? "Following" : "Follow"}
                    </button>
                </div>
            )}

            <div>
                <h3 className="font-semibold mb-3">Related Posts</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    <Link
                        href="https://react.dev/reference/react/Component"
                        className="text-sm hover:underline cursor-pointer"
                    >
                        Understanding React Server Components
                    </Link>
                    <Link
                        href="https://nodejs.org/docs/latest/api/"
                        className="text-sm hover:underline cursor-pointer"
                    >
                        Node.js API Guide
                    </Link>
                    <Link
                        href="https://chatgpt.com/"
                        className="text-sm hover:underline cursor-pointer"
                    >
                        Top 10 Web Dev Tools
                    </Link>
                </div>
            </div>

        </div>
    </div>

}