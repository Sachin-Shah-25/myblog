"use client"
import { signUpUser } from "@/app/api/lib/api";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaMoon } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react"

export default function Signup() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [getError, setError] = useState(null);
  const [getName, setName] = useState("")
  const [getEmail, setEmail] = useState("")
  const [getPass, setPass] = useState("")
  const { mutate, isPending } = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      setRedirecting(true)

      router.replace("/signin")
    },
    onError: (err) => {
      setError(err.message)
    }
  })
  const formSubmit = (e) => {
    e.preventDefault();
    mutate({ name: getName, email: getEmail, password: getPass })
  }

  if (isPending || redirecting) {

    return <div className="flex justify-center mt-4">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>


  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-md">
              D
            </span>
            DevBlog
          </h2>

          <div className="flex items-center gap-3">
            <FaMoon className="text-gray-600 cursor-pointer" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Sign Up</h1>
           {
            !getError 
            ?<p className="text-sm text-gray-500 mt-1"> Create your account. It's quick and easy.</p>
            :<p className="text-sm  text-red-500 mt-1">{getError}</p>
          }
          
        </div>

        <form className="space-y-4" onSubmit={(e) => formSubmit(e)}>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <FaUser className="text-gray-400 mr-2" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={getName}
              type="text"
              placeholder="Name"
              className="w-full outline-none text-sm"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={getEmail}
              type="email"
              placeholder="Email"
              className="w-full outline-none text-sm"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <FaLock className="text-gray-400 mr-2" />

            <input
              onChange={(e) => setPass(e.target.value)}
              value={getPass}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full outline-none text-sm"
            />

            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="ml-2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition font-medium cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition text-sm">
          <FcGoogle size={18} />
          Sign Up with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-500 cursor-pointer hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
         