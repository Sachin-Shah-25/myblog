"use client"
import LeftSection from "@/components/Home/LeftSection";
import Navbar from "@/components/Home/Navbar";
import RightSection from "@/components/Home/RightSection";
import Image from "next/image";
import { FaAngleDown } from "react-icons/fa";
import FullScreenLoader from "@/components/Extra/FullScreenLoader";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/Context/AppContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser } from "./api/lib/api";
import GlobalError from "./error";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [getUser, setUser] = useState(null)
  const { loading } = useContext(AppContext)
  const [getAction, setAction] = useState(null)
  const [category, setCategory] = useState("null");
  const [showRight, setShowRight] = useState(false);
  const [closing, setClosing] = useState(false);
  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
    retry: false,

  })
  const categories = ["Html", "Css", "Javascript", "Nodejs", "Reactjs", "Nextjs", "Expressjs", "mongoDB", "TailwindCss", "Java", "Ejs", "Python"]

  
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShowRight(false);
      setClosing(false);
    }, 300);
  };

  if (isLoading) {
    return <FullScreenLoader></FullScreenLoader>
  }
  if (error) {
    if (error.message === "LOGIN _ERROR") {
      router.push("/signin")
    }
  }

  return (
    <div className="w-full min-h-screen bg-white" style={{ padding: "10px 10px" }}>
      <Navbar />

      <ul className="w-full py-8 px-3 flex justify-center flex-wrap gap-2 border-b border-gray-200" style={{ padding: "30px 10px" }}>
        {categories.map((item, index) => (
          <li
            key={index + item}
            onClick={() => setCategory(item)}
            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium
          bg-gray-50 text-gray-600 border border-gray-200
          hover:bg-black hover:text-white cursor-pointer transition`}
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="md:hidden flex justify-end px-4 mt-4">
        <button
          onClick={(e) => { e.stopPropagation(); setShowRight(true); }}
          className="px-4 py-2 bg-black text-white cursor-pointer text-sm rounded-full"
        >
          Who to follow
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6 mt-6 items-start">

        <div className="w-full md:w-2/3">
          <LeftSection category={category} />
        </div>

        <div className="hidden md:block lg:w-1/3 sticky top-4 self-start slide-in-right">
          <RightSection />
        </div>

      </div>

      {showRight && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={handleClose}
        >
          <div
            className={`absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white p-6 shadow-lg ${closing ? "slide-out-right" : "slide-in-right"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="mb-4 cursor-pointer text-gray-400 hover:text-black text-sm"
            >
              ✕ Close
            </button>
            <RightSection />
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-xs text-gray-400 py-4 border-t">
        Made by Sachin Shah
      </p>
    </div>
  );
}
