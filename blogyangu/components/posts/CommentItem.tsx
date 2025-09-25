import { useState } from "react"
import { CommentItemProps } from "./types"

export default function CommentItem({ 
  comment, 
  getAuthorDisplay, 
  getAvatarUrl, 
  getInitials 
}: CommentItemProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-3">
        {getAvatarUrl(comment.author) && !imageError ? (
          <img
            src={getAvatarUrl(comment.author)!}
            alt={getAuthorDisplay(comment.author)}
            className="w-8 h-8 rounded-full border border-gray-600"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center border border-gray-600">
            <span className="text-blue-300 text-sm font-medium">
              {getInitials(comment.author)}
            </span>
          </div>
        )}
        <div>
          <div className="text-white font-medium text-sm">
            {getAuthorDisplay(comment.author)}
          </div>
        </div>
      </div>
      <p className="text-gray-200 text-sm leading-relaxed">{comment.content}</p>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 mt-3 space-y-3 border-l-2 border-gray-600 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              getAuthorDisplay={getAuthorDisplay} 
              getAvatarUrl={getAvatarUrl} 
              getInitials={getInitials} 
            />
          ))}
        </div>
      )}
    </div>
  )
}