import { CommentProps } from "./types"
import CommentList from "./CommentList"
import { getAuthorDisplay, getAvatarUrl, getInitials } from "./utils/authorUtils"

export default function CommentSection({ 
  post, 
  commentText, 
  setCommentText, 
  onSubmitComment, 
  loadingComments, 
  commentsByPost,
  isAdminOrAuthor,
  onApproveComment,
  onReplyComment,
  onLikeComment,
  onDenyComment,
  onEditComment,
  onDeleteComment,
  currentUserId
}: CommentProps) {
  return (
    <>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        rows={3}
        placeholder="Share your thoughts..."
        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCommentText((t: string) => `${t}${t && !t.endsWith(' ') ? ' ' : ''}😊`)}
          className="text-sm text-yellow-300 hover:text-yellow-200"
        >
          Add emoji
        </button>
        <button
          onClick={() => onSubmitComment(post.id)}
          disabled={!commentText.trim()}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
        >
          Post Comment
        </button>
      </div>

      <CommentList 
        post={post}
        loadingComments={loadingComments}
        commentsByPost={commentsByPost}
        getAuthorDisplay={getAuthorDisplay}
        getAvatarUrl={getAvatarUrl}
        getInitials={getInitials}
        isAdminOrAuthor={isAdminOrAuthor}
        onApproveComment={onApproveComment}
        onReplyComment={onReplyComment}
        onLikeComment={onLikeComment}
        onDenyComment={onDenyComment}
        onEditComment={onEditComment}
        onDeleteComment={onDeleteComment}
        currentUserId={currentUserId}
      />
    </>
  )
}