"use client"
import Link from 'next/link'
import React,{useState} from 'react'
import FormatTime from '../Extra/FormatTime'

function CommentView({ com, onDelete, onReply, depth = 0,commentby }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const maxDepth = 3; 

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(com._id, replyText,commentby);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className={`mt-4 ${depth > 0 ? "ml-8 pl-4 border-l-2 border-gray-200" : ""}`}>
      <div className="flex gap-3 items-start">
        <Link href={`/viewuser/${com?.commentby?._id}`} className="flex-shrink-0">
          <img
            src={
              com.myimage
                ? `/profile/${com.myimage}`
                : com?.commentby?.userImage
                ? `/profile/${com.commentby.userImage}`
                : `/image/image.png`
            }
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm text-gray-800">
              {com?.name ?? com?.commentby?.name}
            </p>
            <p className="text-xs text-gray-500">{FormatTime(com.createdAt)}</p>
          </div>

          <p className="text-sm text-gray-700 mt-1">{com.comment}</p>

          <div className="flex gap-3 mt-2">
            {depth < maxDepth && (
              <button
                onClick={() => setShowReplyBox((prev) => !prev)}
                className="text-xs cursor-pointer text-blue-500 hover:text-blue-700"
              >
                {showReplyBox ? "Cancel" : "↩ Reply"}
              </button>
            )}
            <button
              onClick={() => onDelete(com._id)}
              className="text-xs cursor-pointer text-red-400 hover:text-red-600"
            >
              ✕ Delete
            </button>
          </div>

          {showReplyBox && (
            <div className="mt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply likh..."
                rows={2}
                className="resize-none w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleReplySubmit}
                  className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded-lg"
                >
                  Post
                </button>
                <button
                  onClick={() => setShowReplyBox(false)}
                  className="text-xs px-4 py-1.5 rounded-lg border text-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {com.replies && com.replies.length > 0 && (
        <div className="mt-2">
          {com.replies.map((reply) => (
            <CommentView
              key={reply._id}
              com={reply}
              onDelete={onDelete}
              onReply={onReply}
              depth={depth + 1}
              commentby={com?.commentby?._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}


export default React.memo(CommentView)