import { CommentProps } from "./types"
import CommentList from "./CommentList"
import { getAuthorDisplay, getAvatarUrl, getInitials } from "./utils/authorUtils"

export default function CommentSection({ 
  post, 
  commentText, 
  setCommentText, 
  onSubmitComment, 
  loadingComments, 
  commentsByPost 
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

      <button
        onClick={() => onSubmitComment(post.id)}
        disabled={!commentText.trim()}
        className="mt-3 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        Post Comment
      </button>

      <CommentList 
        post={post}
        loadingComments={loadingComments}
        commentsByPost={commentsByPost}
        getAuthorDisplay={getAuthorDisplay}
        getAvatarUrl={getAvatarUrl}
        getInitials={getInitials}
      />
    </>
  )
}