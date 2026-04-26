import Link from "next/link"
import { FaYoutube, FaGithub, FaLinkedin } from "react-icons/fa"
import React from 'react'
 function IconsComp({ youtube, linkedin , github }) {


    return <div className="flex gap-3 text-lg" onClick={(e) => e.stopPropagation()}>

        <Link href={youtube} target="_blank">
            <FaYoutube className="text-red-500 hover:scale-110 transition cursor-pointer" />
        </Link>

        <Link href={github} target="_blank">
            <FaGithub className="hover:scale-110 transition cursor-pointer" />
        </Link>

        <Link href={linkedin} target="_blank">
            <FaLinkedin className="text-blue-600 hover:scale-110 transition cursor-pointer" />
        </Link>

    </div>
}
export default React.memo(IconsComp)