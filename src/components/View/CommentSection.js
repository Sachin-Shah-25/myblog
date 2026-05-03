"use client"
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link';
import React, { useOptimistic, useState, useTransition } from 'react'
import FormatTime from '../Extra/FormatTime';
import CommentView from './CommentView';

function CommentSection({ comment, postid, udpateComment, user }) {
    const queryClient = useQueryClient()
    const [isPending, startTransition] = useTransition()
    const [getCommentByUser, setCommentByUser] = useState("")
    const [comments, setComments] = useState(comment)

    const deleteFromTree = (comments, commentId) => {
        return comments
            .filter(comment => comment._id !== commentId)
            .map(comment => ({
                ...comment,
                replies: deleteFromTree(comment.replies || [], commentId)
            }));
    };

    const insertReplyInTree = (comments, parentId, newReply) => {
        return comments.map(comment => {
            if (comment._id === parentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            if (comment.replies?.length > 0) {
                return {
                    ...comment,
                    replies: insertReplyInTree(comment.replies, parentId, newReply)
                };
            }
            return comment;
        });
    };

    const [optimisticComments, setOptimisticComments] = useOptimistic(
        comments,
        (prevComments, { type, payload }) => {
            if (type === "ADD_ROOT") return [...prevComments, payload];
            if (type === "ADD_REPLY") return insertReplyInTree(prevComments, payload.parentcomment, payload);
            if (type === "DELETE") return deleteFromTree(prevComments, payload.commentId);
            return prevComments;
        }
    );

    const addComment = async () => {
        if (!getCommentByUser.trim()) return;
        const fakeComment = {
            _id: `temp-${Date.now()}`,
            comment: getCommentByUser,
            postid,
            commentby: { _id: user.id, username: user?.username, userImage: user?.userImage },
            parentcomment: null,
            replies: [],
            createdAt: new Date().toISOString(),
        }
        startTransition(async () => {
            setOptimisticComments({ type: "ADD_ROOT", payload: fakeComment });
            try {
                const res = await fetch('/api/auth/comment', {
                    method: "POST",
                    body: JSON.stringify(fakeComment),
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                })
                if (!res.ok) throw new Error("Something went wrong")
                setComments((prev) => [...prev, fakeComment])
                setCommentByUser("")
                udpateComment(optimisticComments.length + 1)
                queryClient.invalidateQueries({ queryKey: ["view", postid] })
            } catch (err) {
                console.log(err.message)
            }
        });
    }

    const addReply = async (parentCommentId, replyText) => {
        if (!parentCommentId || !replyText.trim()) return;
        const fakeReply = {
            _id: `temp-${Date.now()}`,
            comment: replyText,
            postid,
            commentby: { _id: user.id, username: user?.username, userImage: user?.userImage },
            parentcomment: parentCommentId,
            replies: [],
            createdAt: new Date().toISOString(),
        }
        startTransition(async () => {
            setOptimisticComments({ type: "ADD_REPLY", payload: fakeReply });
            try {
                const res = await fetch(`/api/auth/comment/${parentCommentId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        comment: replyText,
                        parentCommentId,
                        postid,
                        commentby: user.id,
                    }),
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Something went wrong");
                }
                queryClient.invalidateQueries({ queryKey: ["view", postid] })
            } catch (e) {
                console.error("Add Reply Error:", e);
            }
        });
    };

    const deleteComment = async (commentId) => {
        if (!commentId) return;
        startTransition(async () => {
            setOptimisticComments({ type: "DELETE", payload: { commentId } });
            try {
                const res = await fetch(`/api/auth/comment/${commentId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    const errorData = errorText ? JSON.parse(errorText) : {};
                    throw new Error(errorData.message || "Something went wrong");
                }
                setComments(prev => deleteFromTree(prev, commentId));
                queryClient.invalidateQueries({ queryKey: ["view", postid] });
            } catch (e) {
                console.error("Delete Error:", e);
            }
        });
    };

    return (
        <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            <textarea
                onChange={(e) => setCommentByUser(e.target.value)}
                value={getCommentByUser}
                placeholder="Write a comment..."
                className="resize-none w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
                onClick={addComment}
                disabled={isPending}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg cursor-pointer disabled:opacity-50"
            >
                {isPending ? "Posting..." : "Post Comment"}
            </button>

            {isPending && (
                <div className="flex justify-center mt-4">
                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {optimisticComments?.length > 0 &&
                optimisticComments.map((com) => (
                    <CommentView
                        key={com._id}
                        com={com}
                        onDelete={deleteComment}
                        onReply={addReply}
                    />
                ))}
        </div>
    )
}

export default React.memo(CommentSection)
