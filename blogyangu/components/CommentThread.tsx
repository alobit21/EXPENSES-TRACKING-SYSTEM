// components/CommentThread.tsx
import { useState } from 'react'
import Image from 'next/image'
import { CommentWithAuthor } from '../types/blog'

interface CommentThreadProps {
  comment: CommentWithAuthor
  postId: number
  onReply: (parentId: number, content: string) => void
}

export default function CommentThread({ comment, postId, onReply }: CommentThreadProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent)
      setReplyContent('')
      setIsReplying(false)
    }
  }

  return (
    <div className="border-l-2 border-gray-200 pl-4 my-4">
      <div className="flex items-start space-x-3">
        <Image
          src={comment.author.avatarUrl || '/default-avatar.png'}
          alt={comment.author.displayName || comment.author.username}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <div className="bg-gray-100 p-3 rounded-lg">
            <h4 className="font-semibold">
              {comment.author.displayName || comment.author.username}
            </h4>
            <p className="text-gray-700">{comment.content}</p>
          </div>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <button 
              className="text-blue-600 hover:text-blue-800"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </button>
            <span className="text-gray-500">
              {comment._count?.likes || 0} likes
            </span>
          </div>

          {isReplying && (
            <div className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Post Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}