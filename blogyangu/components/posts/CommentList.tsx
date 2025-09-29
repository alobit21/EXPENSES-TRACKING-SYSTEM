import { CommentListProps } from "./types"
import CommentItem from "./CommentItem"

export default function CommentList({ 
  post, 
  loadingComments, 
  commentsByPost,
  getAuthorDisplay,
  getAvatarUrl,
  getInitials,
  isAdminOrAuthor,
  onApproveComment,
  onReplyComment,
  onLikeComment,
  onDenyComment,
  onEditComment,
  onDeleteComment,
  currentUserId,
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
          isAdminOrAuthor={isAdminOrAuthor}
          currentUserId={currentUserId}
          onApprove={onApproveComment ? () => onApproveComment(comment.id, post.id) : undefined}
          onReply={onReplyComment ? (content) => onReplyComment(post.id, comment.id, content) : undefined}
          onLike={onLikeComment ? () => onLikeComment(comment.id, post.id) : undefined}
          onDeny={onDenyComment ? (note) => onDenyComment(comment.id, post.id, note) : undefined}
          onEdit={onEditComment ? (content) => onEditComment(comment.id, post.id, content) : undefined}
          onDelete={onDeleteComment ? () => onDeleteComment(comment.id, post.id) : undefined}
        />
      ))}
    </div>
  )
}