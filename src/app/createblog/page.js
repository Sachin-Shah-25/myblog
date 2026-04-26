"use client"
import Navbar from "@/components/Home/Navbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { blogpost } from "../api/lib/api";
import { FaYoutube, FaGithub, FaLinkedin } from "react-icons/fa"
export default function CreateBlog() {
  const [loading, setLoading] = useState(true)
  const [getError, setError] = useState(null)
  const getClient = useQueryClient()
  const [redirecting, setRedirecting] = useState(false);

  const getUser = getClient.getQueryData(["user"])
  const router = useRouter();
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [tags, setTags] = useState([])
  const [links, setLinks] = useState({
    youtube: "",
    github: "",
    linkedin: ""
  })

  const { mutate, isPending,isSuccess } = useMutation({
    mutationFn: blogpost,
    onSuccess: (data) => {
      getClient.invalidateQueries({ queryKey: ["blogs"] })
      router.push("/")
    },
    onError: (err) => {
      setError(err.message)
    }
  })

  const postFun = () => {
    if (tags.length === 0) {
      setError("At least one tag are required ")
      return;
    }
    const formData = new FormData()

    formData.append("title", title)
    formData.append("description", description)
    formData.append("imagefile", image)
    formData.append("userid", getUser.id)
    formData.append("tags", tags.length > 0 && tags.join(","))
    formData.append("youtube",links.youtube)
    formData.append("github",links.github)
    formData.append("linkedin",links.linkedin)

    mutate(formData)
  }
  useEffect(() => {
    if (!getUser) {
      router.replace("/signin")
    }
    setLoading(false)
  }, [getUser])

  if (isPending || loading) {
    return <div className="flex justify-center mt-4" >
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  }
  return (
    <div className="min-h-screen px-3 md:px-6 py-6 bg-gray-50">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="col-span-1 md:col-span-3 bg-white p-4 md:p-6 rounded-xl shadow-sm">

          {
            getError && (
              <h4 className="w-full text-center font-semibold text-red-600 mb-3">
                !! {getError}.
              </h4>
            )
          }

          <h2 className="text-2xl md:text-3xl font-semibold mb-2">
            Create New Blog
          </h2>

          <p className="text-gray-500 mb-4 text-sm md:text-base">
            Write and share your thoughts.
          </p>

          <input
            type="text"
            placeholder="Enter your title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none text-sm md:text-base"
          />

          <label className="border-2 border-dashed rounded-lg p-6 md:p-10 text-center mb-4 text-gray-500 cursor-pointer block hover:border-blue-400 transition">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <p className="text-base md:text-lg">📷 Click to upload an image</p>
            <p className="text-xs md:text-sm">SVG, PNG, JPG, or GIF (Max 5MB)</p>
            {image && <p className="mt-2 text-green-600 text-sm">{image.name}</p>}
          </label>

          <div className="flex flex-wrap gap-3 border rounded-t-lg p-3 bg-gray-50 text-gray-600 text-sm">
            <span>H1</span>
            <span>B</span>
            <span>I</span>
            <span>• List</span>
            <span>🔗</span>
          </div>

          <textarea
            placeholder="Write your blog content here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-52 md:h-64 border border-t-0 rounded-b-lg p-4 focus:outline-none text-sm md:text-base"
          ></textarea>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">

          <h3 className="font-semibold mb-2 text-lg">Tags</h3>

          <select
            className="w-full border p-2 rounded-lg mb-3 text-sm"
            onChange={(e) => {
              const value = e.target.value
              if (!tags.includes(value)) {
                setTags([...tags, value])
              }
            }}
          >
            <option>Select tags...</option>
            <option>Java</option>
            <option>HTML</option>
            <option>Javascript</option>
            <option>React</option>
            <option>CSS</option>
            <option>Express</option>
            <option>NodeJS</option>
            <option>MongoDB</option>
          </select>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                onClick={() => {
                  setTags(tags.filter((t) => t !== tag))
                }}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs md:text-sm cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
              >
                {tag} ✕
              </span>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button className="w-full py-2 bg-gray-200 rounded-lg cursor-pointer text-sm">
              Save Draft
            </button>
            <button
              onClick={() => postFun()}
              className="w-full py-2 bg-blue-500 cursor-pointer text-white rounded-lg text-sm hover:bg-blue-600 transition"
            >
              Publish
            </button>
          </div>
          <div className="mt-4 bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold mb-3 text-sm md:text-base">
              Add Social Links
            </h3>

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
          </div>
        </div>

      </div>
    </div>
  );
}