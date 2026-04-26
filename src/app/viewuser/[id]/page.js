"use client";
import FullScreenLoader from "@/components/Extra/FullScreenLoader";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function profile() {
    const { id } = useParams()
    const fetchProfile = async () => {

        const res = await fetch(`/api/auth/viewuser/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        });
        if (!res.ok) {
            throw new Error("Something went wrong");
        }
        const result = await res.json()
        return result.data;
    };


    const { data, isPending, error } = useQuery({
        queryKey: ["profile", id],
        queryFn: fetchProfile,
        refetchOnWindowFocus: false,
        refetchOnReconnect:true,
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
        onError: (e) => console.log(e.message)
    });
    if (isPending) {
        return <FullScreenLoader></FullScreenLoader>
    }
    return (<div className="max-w-5xl p-6">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

            <div className="relative">

                <img
                    src={data?.user?.userImage
                        ? `/profile/${data.user.userImage}`
                        : "/profile/image.png"}
                    alt="profile"
                    className="w-32 h-32  md:w-40 md:h-40 rounded-full object-cover border border-gray-300" style={{ padding: "1px" }}
                />


            </div>

            <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold capitalize">{data.user.name}</h2>

                <div className="flex justify-center md:justify-start gap-6 mt-3">
                    <p><span className="font-semibold">{data.blogs.length}</span> Posts</p>
                    <p><span className="font-semibold">{data.stats.followers}</span> Followers</p>
                    <p><span className="font-semibold">{data.stats.following}</span> Following</p>
                </div>

                <p className="mt-4 text-gray-600 max-w-md">
                    {data.user.bio}
                </p>
            </div>
        </div>

        <div className="mt-10 border-b border-gray-200 flex gap-6 justify-center md:justify-start">
            <button className="pb-2 border-b-2 border-blue-500 font-medium">
                Posts
            </button>

        </div>

        {
            data.blogs.length > 0
                ? <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    { data.blogs.map((item) => (

                        <Link href={`/view/${item._id}`}
                            key={item._id}
                            className="relative group border border-gray-100 rounded-xl p-2 cursor-pointer"
                        >
                            <img
                                src={item?.image
                                    ? `/image/${item.image}`
                                    : `/image/image.png`
                                }
                                className="w-full h-48 object-cover rounded-lg"
                            />

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold transition">
                                {item.comments.length} View
                            </div>
                        </Link>
                        ) )}
                </div>
                : <div className="w-full h-full flex items-center justify-center text-3xl mt-8 text-gray-300"> No Post </div>
        }


    </div>
    )
}
