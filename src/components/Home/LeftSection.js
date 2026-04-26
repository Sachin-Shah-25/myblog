import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from 'react'
import { FaArrowCircleUp } from "react-icons/fa";
import FullScreenLoader from "../Extra/FullScreenLoader";
import React from 'react'
import { FaYoutube, FaGithub, FaLinkedin } from "react-icons/fa"
import IconsComp from "../IconsComp";
function LeftSection({ category }) {
  const scrollRef = useRef();
  const [showScroll, hideScroll] = useState(false)
  const getQuery = useQueryClient()

  const { data, isPending } = useQuery({
    queryKey: ["blogs", category],
    queryFn: async () => {
      const res = await fetch(`/api/auth/blog/${category}`, {
        method: "GET",
        credentials: "include"
      })
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Something Went Wrong")
      }
      return data
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount:true,
    staleTime: 1000 * 60 * 5,
    onError: ((err) => console.log(err.message || "Something went wrong"))
  })

  useEffect(() => {
    function scrollchange() {
      if (window.scrollY >= 800 && !showScroll) {
        hideScroll(true)
      }
      if (window.scrollY <= 800 && showScroll) {
        hideScroll(false)
      }
    }

    window.addEventListener("scroll", scrollchange)

    return () => window.removeEventListener("scroll", scrollchange)
  }, [showScroll])

  if (isPending) {
    return <FullScreenLoader></FullScreenLoader>
  }

  return (
    <div className="w-full relative">
      <div ref={scrollRef}></div>

      <div className="w-full">
        <h1 className="text-gray-500 text-xl sm:text-2xl font-semibold">
          Recommended Posts
        </h1>
      </div>

      <div className="w-full grid mt-4">
        <div className="w-full">
          <Image
            src={data?.randomBlog[0]?.image
              ? `/image/${data.randomBlog[0].image}`
              : `/image/image.png`}
            alt="image1"
            width={800}
            height={500}
            className="w-full h-48 sm:h-64 md:h-[300px] object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <h1 className="text-xl sm:text-2xl font-semibold">
          {data?.randomBlog[0]?.title}
        </h1>
      </div>
      <div>
        <p className="text-sm mt-3 text-gray-500">
          {data?.randomBlog[0]?.description}
        </p>
      </div>

      <div className="flex mt-8 sm:mt-12 gap-3 sm:gap-4 border-b border-gray-100 pb-6 sm:pb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={data?.randomBlog[0]?.createdBy.userImage
              ? `/profile/${data.randomBlog[0].createdBy.userImage}`
              : `/image/image.png`}
            alt="image1"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-gray-700 font-medium">
          <div className="w-full flex justify-between ">
            <div className="flex flex-wrap gap-2 items-center">
              <h6 className="text-lg sm:text-xl">{data?.randomBlog[0]?.createdBy.name}</h6>
              <span className="text-[10px]">{data?.date}</span>
            </div>
            {/* <div className="flex gap-3 text-lg">

              <Link href={data?.randomBlog[0]?.createdBy?.youtube || "#"} target="_blank">
                <FaYoutube className="text-red-500 hover:scale-110 transition cursor-pointer" />
              </Link>

              <Link href={data?.randomBlog[0]?.createdBy?.github || "#"} target="_blank">
                <FaGithub className="hover:scale-110 transition cursor-pointer" />
              </Link>

              <Link href={data?.randomBlog[0]?.createdBy?.linkedin || "#"} target="_blank">
                <FaLinkedin className="text-blue-600 hover:scale-110 transition cursor-pointer" />
              </Link>

            </div> */}
            <IconsComp
              youtube={data?.randomBlog[0]?.youtube || "#"}
              linkedin={data?.randomBlog[0]?.linkedin || "#"}
              github={data?.randomBlog[0]?.github || "#"}  >
            </IconsComp>
          </div>
          <p className="text-[10px] text-gray-600">{data?.randomBlog[0]?.createdBy.bio}</p>
        </div>
      </div>

      <div className="pt-6 sm:pt-8">
        {data?.blogs?.length == 0 ? (
          <div className="h-full w-full flex items-center justify-center">
            <h1 className="text-gray-400 text-2xl sm:text-3xl font-semibold">Nothing to Show</h1>
          </div>
        ) : (
          <div className="w-full p-3 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Latest Posts</h2>

            <div className="space-y-4 sm:space-y-6">
              {isPending ? (
                <div className="flex justify-center mt-4">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                data?.blogs?.map((post, index) => (
                  <Link
                    href={`/view/${post._id}`}
                    key={post._id}
                    className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-4 sm:pb-6 sm:pt-4 last:border-none"
                  >
                    <div className="w-full h-44 sm:w-40 sm:h-28 relative flex-shrink-0">
                      <Image
                        src={`/image/${post.image}`}
                        alt={post.title}
                        height={120}
                        width={150}
                        className="w-full h-full rounded-2xl sm:rounded-3xl border object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between w-full">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {post.description.length > 40
                            ? post.description.substring(0, 40) + "..."
                            : post.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                        <div className="w-full flex justify-between ">
                          <div className="flex items-center gap-3">
                            <Image
                              src={post?.createdBy?.userImage
                                ? `/profile/${post.createdBy.userImage}`
                                : `/image/image.png`}
                              alt={post.title}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <div className="text-sm text-gray-600">
                              <p className="font-medium text-gray-800">{post.createdBy.name}</p>
                              <p className="text-xs">{post.createdAtFormatted}</p>
                            </div>
                          </div>
                          <IconsComp
                            youtube={post?.youtube || "#"}
                            linkedin={post?.linkedin || "#"}
                            github={post?.github || "#"}  >
                          </IconsComp>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {post.tags.length > 0 &&
                            post.tags[0].split(",").map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showScroll && (
        <div
          onClick={() => scrollRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="fixed w-8 h-8 bg-gray-400 text-white rounded-full flex justify-center items-center right-4 sm:right-[50%] bottom-[5%] text-xl cursor-pointer z-50"
        >
          <FaArrowCircleUp />
        </div>
      )}
    </div>
  );
}

export default React.memo(LeftSection);