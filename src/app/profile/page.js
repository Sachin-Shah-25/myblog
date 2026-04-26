"use client";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { fetchUser } from "../api/lib/api";
import Link from "next/link";
import ProfileFollow from "@/components/Profile/ProfileFollow";
import { CiMenuKebab } from "react-icons/ci";
import UpdateComponent from "@/components/Profile/UpdateComponent";
import { FaYoutube, FaGithub, FaLinkedin } from "react-icons/fa"
import IconsComp from "@/components/IconsComp";

export default function ProfilePage() {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false);
    const [openDrawer, setDrawer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [myData, setMyData] = useState(null);
    const [getAction, setAction] = useState(null)
    const fileRef = useRef(null);
    const [getNickName, setNickName] = useState("")
    const [links, setLinks] = useState({
        youtube: "",
        github: "",
        linkedin: ""
    })
    const [image, setImage] = useState({
        fake: null,
        real: null
    }
    );

    const fetchProfile = async () => {

        const res = await fetch("/api/auth/profile", {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
            throw new Error("Something went wrong");
        }
        const result = await res.json()
        return result.data;
    };

    const { data, isPending, error } = useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfile,
        refetchOnWindowFocus: false,
        refetchOnReconnect:true,
        refetchOnMount:true,
        staleTime: 1000 * 60 * 5,
    });
    const [bio, setBio] = useState(data?.user?.bio)
    const handleImageClick = () => {
        fileRef.current.click();
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const url = URL.createObjectURL(file);
            setImage({ fake: url, real: file });
        }

    };
    const profileChange = async () => {
        if (!data?.user?._id) {
            return
        }

        const formData = new FormData()
        formData.append("myimage", image.real ? image.real : null)
        formData.append("bio", bio ? bio : data.user.bio)
        formData.append("userid", data.user._id)
        formData.append("nickname", getNickName ? getNickName : data.user.nickname)
        formData.append("youtube", links.youtube)
        formData.append("github", links.github)
        formData.append("linkedin", links.linkedin)


        try {
            setLoading(true)

            const res = await fetch("/api/auth/profileupdate", {
                method: "POST",
                body: formData,
                credentials: "include"
            })
            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.message || "Something went wrong")
            }
            queryClient.invalidateQueries({ queryKey: ["profile"] })

        } catch (e) {
            console.log("ERROR:", e.message)
        } finally {



            setLoading(false)
            setOpen(false)
            setImage({
                fake: null,
                real: null
            })
        }
    }

    if (isPending || loading) {
        return <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    }
    // if (isPending) {
    //     return <div className="flex justify-center mt-4">
    //         <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    //     </div>
    // }


    return (
        <div className="w-full p-6" style={{ padding: "30px 20px" }}>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

                <div className="relative">

                    <img
                        src={data?.user?.userImage
                            ? `/profile/${data.user.userImage}`
                            : "/profile/image.png"}
                        alt="profile"
                        className="w-32 h-32  md:w-40 md:h-40 rounded-full object-cover border border-gray-300" style={{ padding: "1px" }}
                    />

                    <button
                        onClick={() => setOpen(true)}
                        className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 cursor-pointer rounded-full shadow"
                    >
                        📷
                    </button>

                    <input
                        type="file"
                        ref={fileRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="flex-1 text-center md:text-center">
                    <div className=" w-full flex flex-col items-start">
                        <h2 className="text-2xl font-bold capitalize text-left ">
                            {data.user.name}
                        </h2>
                        <span className="text-gray-400 mt-2 lowercase block text-left md:text-center">
                            {data.user?.nickname}
                        </span>
                    </div>


                    <div className="flex justify-center md:justify-start gap-6 mt-3">
                        <p><span className="font-semibold">{data.blogs.length}</span> Posts</p>
                        <p className="cursor-pointer"
                            onClick={() => {
                                setAction(data.stats.followers)
                                setDrawer(true)
                            }}

                        ><span className="font-semibold cursor-pointer" >{data.stats.followers.length}</span> Followers</p>
                        <p className="cursor-pointer" onClick={() => {
                            setAction(data.stats.following)
                            setDrawer(true)
                        }}><span className="font-semibold cursor-pointer">{data.stats.following.length}</span> Following</p>
                    </div>

                    <p className="mt-4 text-gray-600 max-w-md">
                        {data.user.bio}
                    </p>
                    <div className="max-w-md mt-4 flex items-center justify-center">
                        <IconsComp
                            youtube={data.user?.youtube || "#"}
                            linkedin={data.user?.linkedin || "#"}
                            github={data.user?.github || "#"}  >
                        </IconsComp>
                    </div>

                </div>
            </div>

            <div className="mt-10 border-b border-gray-200 flex gap-6 justify-center md:justify-start">
                <button className="pb-2 border-b-2 border-blue-500 font-medium">
                    Posts
                </button>
                <button className="pb-2 text-gray-500 cursor-pointer" >Saved</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {data.blogs.map((item) => {
                    return <div className="border relative border-gray-100 rounded-xl p-2 cursor-pointer">

                        <Link href={`/view/${item._id}`} className="block">

                            <div className="relative group">
                                <img
                                    src={
                                        item?.image
                                            ? `/image/${item.image}`
                                            : `/image/image.png`
                                    }
                                    className="w-full h-48 object-cover rounded-lg"
                                />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold transition">
                                    {item.comments.length} View
                                </div>
                            </div>

                        </Link>


                        <UpdateComponent item={item} ></UpdateComponent>


                    </div>
                })}
            </div>
            {
                open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                        <div className="bg-white w-[400px] rounded-2xl p-6 relative shadow-xl">

                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-4 right-4 text-gray-500"
                            >
                                ✕
                            </button>

                            <h2 className="text-xl font-semibold text-center mb-4">
                                Edit Profile Picture
                            </h2>

                            <div className="flex justify-center">
                                <div className="relative">
                                    <img
                                        src={image.fake ? image.fake : `profile/image.png`}
                                        className="w-32 h-32 rounded-full object-cover"
                                    />

                                    <button
                                        onClick={handleImageClick}
                                        className="absolute bottom-0 right-0 bg-blue-500 cursor-pointer text-white p-2 rounded-full"
                                    >
                                        📷
                                    </button>
                                </div>

                            </div>

                            <input
                                type="file"
                                ref={fileRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />


                            <p className="text-sm text-gray-500 text-center mt-3">
                                Click image to change
                            </p>
                            <textarea className="w-full p-2 text-sm resize-none mt-10 border border-gray-200 rounded-xl" placeholder={"Edit bio...."} onChange={(e) => setBio(e.target.value)} ></textarea>
                            <div className="mt-2 flex border border-gray-200 rounded-xl">
                                <div className="p-2 text-gray-400 border-r border-red-800 text-sm">@</div>
                                <input value={getNickName} onChange={(e) => setNickName(e.target.value)} placeholder="nickname" className="text-sm px-2 w-full" maxLength={6} />
                            </div>

                            <div className="flex flex-col gap-3 mt-4">

                                <div className="flex items-center gap-2 border p-2 rounded-lg bg-white  border-gray-200">
                                    <FaYoutube className="text-red-500 text-lg" />
                                    <input
                                        type="text"
                                        placeholder="YouTube link"
                                        value={links.youtube}
                                        onChange={(e) =>
                                            setLinks({ ...links, youtube: e.target.value })
                                        }
                                        className="w-full outline-none text-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-2 border p-2 rounded-lg bg-white  border-gray-200">
                                    <FaGithub className="text-black text-lg" />
                                    <input
                                        type="text"
                                        placeholder="GitHub link"
                                        value={links.github}
                                        onChange={(e) =>
                                            setLinks({ ...links, github: e.target.value })
                                        }
                                        className="w-full outline-none text-sm "
                                    />
                                </div>

                                <div className="flex items-center gap-2 border p-2 rounded-lg bg-white  border-gray-200">
                                    <FaLinkedin className="text-blue-600 text-lg" />
                                    <input
                                        type="text"
                                        placeholder="LinkedIn link"
                                        value={links.linkedin}
                                        onChange={(e) =>
                                            setLinks({ ...links, linkedin: e.target.value })
                                        }
                                        className="w-full outline-none text-sm"
                                    />
                                </div>

                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>

                                <button className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded" onClick={() => profileChange()}>
                                    Save
                                </button>
                            </div>
                        </div>

                    </div>
                )
            }

            <div>

                {openDrawer && (
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setDrawer(false)}
                    />
                )}

                <div
                    className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-lg
        transform transition-transform duration-300
        ${openDrawer ? "translate-x-0" : "translate-x-full"}`}
                >
                    <div className="flex justify-between p-4 border-b">
                        <h2>Your Friends</h2>
                        <button className="cursor-pointer" onClick={() => setDrawer(false)}>✕</button>
                    </div>



                    <div className="w-full max-w-xs mx-auto bg-white  p-5 rounded-xl ">


                        <div className="space-y-4 mt-4   overflow-hidden">
                            {getAction && getAction.map((user) => {
                                return <ProfileFollow user={user} ></ProfileFollow>

                            })}
                        </div>


                    </div>



                </div>
            </div>

        </div >
    );
}