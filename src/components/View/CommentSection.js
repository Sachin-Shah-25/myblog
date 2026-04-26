"use client"
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link';
import React, { useOptimistic, useState, useTransition } from 'react'
import FormatTime from '../Extra/FormatTime';
import CommentView from './CommentView';
function CommentSection({ comment, postid, udpateComment, user }) {
    const [isPending, startTransition] = useTransition()
    const [getCommentByUser, setCommentByUser] = useState("")
    const [comments, setComments] = useState(comment)
    const [optimisticUpdate, setOptimisticUpdate] = useOptimistic(comments, (prevComments, newComment) =>
        [...prevComments, newComment]
    )
    const addComment = async () => {
        const fakeComment = {
            comment: getCommentByUser,
            postid,
            commentby: {_id:user.id},
            name: user?.username,
            myimage: user?.userImage
        }
        startTransition(() => {
            setOptimisticUpdate(fakeComment)
        });
        udpateComment(optimisticUpdate.length)
        try {
            const res = await fetch('/api/auth/comment', {
                method: "POST",
                body: JSON.stringify(fakeComment),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            if (!res.ok) {
                throw new Error(res.message || "Something went wrong")

            }
            const data = await res.json()
            setComments((prev) => [...prev, fakeComment])
            setCommentByUser("")
        } catch (err) {
            console.log(err.message)
        }
    }

    if (isPending) {
        return <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    }
    return <>
        <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            <textarea onChange={(e) => setCommentByUser(e.target.value)}
                value={getCommentByUser}
                placeholder="Write a comment..."
                className="resize-none w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button onClick={() => addComment()} className="bg-blue-600 text-white px-5 py-2 rounded-lg cursor-pointer">
                Post Comment
            </button>
            {
                optimisticUpdate && optimisticUpdate.length > 0 &&
                optimisticUpdate.map((com, index) => {

                    return <CommentView com={com} key={com._id}></CommentView>
                })
            }
        </div>
    </>
}

export default React.memo(CommentSection)
