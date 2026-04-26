"use client"
import Link from 'next/link'
import React from 'react'
import FormatTime from '../Extra/FormatTime'


function CommentView({ com }) {
    return <Link href={`/viewuser/${com?.commentby?._id}`}  className="mt-8 block">
        <div className="flex gap-3 items-start">
            {
                com.myimage ? <img
                    src={com.myimage
                        ? `/profile/${com.myimage}`
                        : `/image/image.png`
                    }
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover"
                />
                    : <img
                        src={com?.commentby?.userImage
                            ? `/profile/${com.commentby.userImage}`
                            : `/image/image.png`
                        }
                        alt="user"
                        className="w-12 h-12 rounded-full object-cover"
                    />

            }



            <div className="flex flex-col w-full">

                <div className="flex justify-between items-center w-full">

                    <p className="font-semibold text-sm text-gray-800">
                        {com?.name ? com.name : com.commentby.name}
                    </p>

                    <p className="text-xs text-gray-500">
                        {FormatTime(com.createdAt)}
                    </p>

                </div>

                <p className="text-sm text-gray-700 mt-1">
                    {com.comment}
                </p>

            </div>
        </div>
    </Link>
}

export default React.memo(CommentView)