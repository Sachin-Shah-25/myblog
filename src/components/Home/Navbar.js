"use client"
import Link from "next/link";
import { LuFolderTree } from "react-icons/lu";
import { TbBrandWindowsFilled } from "react-icons/tb";
import { FaFilesPinwheel } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { IoCreateOutline } from "react-icons/io5";
import { IoCreate } from "react-icons/io5";
import Image from "next/image";

function Navbar() {
  const queryClient = useQueryClient();
  const getUser = queryClient.getQueryData(["user"])
  const router = useRouter()

  const logoutFun = async () => {

    fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include"
    }).then((res) => {
      if (res.ok) {
        router.replace("/signin")
      }
    }).catch(e => console.log(e.message || "Something went wrong"))
  }
  
  return <nav className="w-full p-2 border-gray-100 flex flex-col justify-center md:flex-row gap-4 md:gap-10 items-center border-b pb-8 px-4">

    <div className="flex gap-2 items-center text-2xl font-semibold">
      <FaFilesPinwheel className="text-white bg-blue-800 p-1 rounded" />
      <h1>DevBlog</h1>
    </div>

    <div className="w-full md:w-1/2 border rounded-3xl px-3 flex items-center">
      <input
        className="w-full py-2 outline-none"
        placeholder="javascript, python..."
      />
      <IoIosSearch className="text-xl text-gray-400" />
    </div>

    <div className="flex gap-3 items-center">
      <Link href="/createblog" className="px-3 text-3xl py-1  rounded">
        <IoCreateOutline />
      </Link>
      <Link href="/profile" className="rounded-lg text-black cursor-pointer transition hover:bg-gray-50  ">
        <Image
          src={getUser?.userImage
            ? `/profile/${getUser?.userImage}`
            : `/image/image.png`}
          alt="image1"
          width={24}
          height={24}
          className="w-full h-full rounded-full object-cover"
        />
      </Link>

      {getUser ? (
        <button
          onClick={logoutFun}
          className="px-3 py-1 ml-2 bg-red-500 text-white cursor-pointer rounded"
        >
          Logout
        </button>
      ) : (
        <Link href="/signin">SignIn</Link>
      )}
    </div>

  </nav>
}
export default Navbar;