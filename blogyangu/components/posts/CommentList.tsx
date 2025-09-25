import { CommentListProps } from "./types"
import CommentItem from "./CommentItem"

export default function CommentList({ 
  post, 
  loadingComments, 
  commentsByPost,
  getAuthorDisplay,
  getAvatarUrl,
  getInitials
}: CommentListProps) {
  if (loadingComments) {
    return (
      <div className="text-center text-gray-400 py-4">
        Loading comments...
      </div>
    )
  }

  if (!commentsByPost[post.id] || commentsByPost[post.id].length === 0) {
    return (
      <div className="text-center text-gray-400 py-4">
        No comments yet. Be the first to comment!
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {commentsByPost[post.id].map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          getAuthorDisplay={getAuthorDisplay}
          getAvatarUrl={getAvatarUrl}
          getInitials={getInitials}
        />
      ))}
    </div>
  )
}