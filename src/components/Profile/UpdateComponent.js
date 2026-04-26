import { CiMenuKebab } from "react-icons/ci";
import { useRef, useState, useEffect } from "react";
import FullScreenLoader from "../Extra/FullScreenLoader";
import { useQueryClient } from "@tanstack/react-query";
import { FaYoutube, FaGithub, FaLinkedin } from "react-icons/fa"

export default function UpdateComponent({ item }) {
    const queryClient = useQueryClient()
    const [openUpdate, setUpdate] = useState(false)
    const [showMenu, setShowMenu] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [getTitle, setTitle] = useState(item?.title);
    const [getDis, setDis] = useState(item?.description);
    const [loading, setLoading] = useState(false)
    const [links, setLinks] = useState({
        youtube: "",
        github: "",
        linkedin: ""
    })
    const UpdateFun = () => {
        setLoading(true)

        setTimeout(async () => {
            try {
                const res = await fetch(`/api/auth/upload/${item._id}`, {
                    method: "PUT",
                    body: JSON.stringify({ title: getTitle, dis: getDis, links }),
                    header: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                })
                if (!res.ok) {
                    throw new Error("Something went wrong")
                }
                const data = await res.json()
                setUpdate(false)

                queryClient.invalidateQueries(["profile"]);

            } catch (e) {
                console.log(e.message)
            }
            setLinks({
                youtube: "",
                github: "",
                linkedin: ""
            })
            setLoading(false);
        }, 1000)
    }
    const deleteFun = () => {
        setOpenDelete(false);
        setLoading(true)

        setTimeout(async () => {
            try {
                const res = await fetch(`/api/auth/upload/${item._id}`, {
                    method: "DELETE",
                    credentials: "include"
                })
                if (!res.ok) {
                    throw new Error("Something went wrong")
                }
                const data = await res.json()
                setUpdate(false)
                queryClient.invalidateQueries(["profile"]);

            } catch (e) {
                console.log(e.message)
            }
            setLoading(false);
        }, 1000)
    }
    return loading ? <FullScreenLoader /> : <div className="flex justify-between p-1 text-black text-lg">
        <div>{item.title}</div>
        <div className="p-1 cursor-pointer" onClick={() => setShowMenu(prev => !prev)}>
            <CiMenuKebab />
        </div>
        {showMenu && (
            <div className="absolute  bg-white right-8 rounded shadow-md z-50">
                <div
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                        setUpdate(true);
                        setShowMenu(false);
                    }}
                >
                    Edit
                </div>

                <div
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-500"
                    onClick={() => {
                        setOpenDelete(true);  
                        setShowMenu(false);
                    }}
                >
                    Delete
                </div>
            </div>
        )}
        {
            openUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 md:flex-col">

                    <div className="bg-white w-[400px] rounded-2xl p-6 relative shadow-xl">

                        <button
                            onClick={() => setUpdate(false)}
                            className="absolute top-4 right-4 text-gray-500"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold text-center mb-4">
                            Update Your Post
                        </h2>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                        />

                        <textarea className="w-full h-40 p-4 text-sm resize-none mt-10 border border-gray-200 rounded-xl" placeholder="Write Detail..." onChange={(e) => setDis(e.target.value)} value={getDis} ></textarea>
                        <div className="mt-5 flex border border-gray-200 rounded-sm mb-8">

                            <input value={getTitle} onChange={(e) => setTitle(e.target.value)} placeholder="title" className="text-sm px-2 w-full p-2" />
                        </div>


                        <div className="flex flex-col gap-3">

                            <div className="flex items-center gap-2 border p-2 rounded-lg bg-white">
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

                            <div className="flex items-center gap-2 border p-2 rounded-lg bg-white">
                                <FaGithub className="text-black text-lg" />
                                <input
                                    type="text"
                                    placeholder="GitHub link"
                                    value={links.github}
                                    onChange={(e) =>
                                        setLinks({ ...links, github: e.target.value })
                                    }
                                    className="w-full outline-none text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-2 border p-2 rounded-lg bg-white">
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
                                onClick={() => setUpdate(false)}
                                className="px-4 cursor-pointer py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded" onClick={() => UpdateFun()}>
                                Update
                            </button>
                        </div>
                    </div>
                    {/* <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                        <h3 className="font-semibold mb-3 text-sm md:text-base">
                            Add Social Links
                        </h3>

                    </div> */}
                </div>
            )
        }

        {openDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                <div className="bg-white w-[350px] rounded-2xl p-6 shadow-xl text-center">

                    <h2 className="text-lg font-semibold mb-4">
                        Delete Post?
                    </h2>

                    <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to delete this post? This action cannot be undone.
                    </p>

                    <div className="flex justify-end gap-3">

                        <button
                            onClick={() => setOpenDelete(false)}
                            className="px-4 py-2 border rounded cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                deleteFun()

                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
                        >
                            Delete
                        </button>

                    </div>
                </div>
            </div>
        )}
    </div>
}