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
  currentUserId,
  onToggleComments
}: CommentProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground dark:text-gray-300">Comments</h4>
        <button
          type="button"
          onClick={() => onToggleComments(post.id)}
          className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:border-foreground/40 dark:border-gray-700 dark:hover:border-gray-500"
        >
          Close
        </button>
      </div>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        rows={3}
        placeholder="Share your thoughts..."
        className="w-full px-4 py-3 rounded-lg bg-background text-foreground border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 resize-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCommentText((t: string) => `${t}${t && !t.endsWith(' ') ? ' ' : ''}😊`)}
          className="text-sm text-yellow-600 hover:text-yellow-700 dark:text-yellow-300 dark:hover:text-yellow-200"
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