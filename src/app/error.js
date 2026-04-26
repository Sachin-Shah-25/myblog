'use client'

import Link from "next/link"

export default function GlobalError() {
    return <html>
        <body className="w-full h-screen bg-gray-800 flex items-center justify-center text-white">
            <div className="flex flex-col items-center">
                <h2 className="text-5xl">Something went wrong</h2>
                <Link href="/" className="border text-3xl font-bold cursor-pointer px-8 py-2 cursor-pointer rounded-lg mt-8" onClick={()=> window.location.reload()} >Try again </Link>
            </div>
        </body>
    </html>
}