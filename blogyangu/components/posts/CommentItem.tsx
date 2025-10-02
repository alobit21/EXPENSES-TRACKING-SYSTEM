import { useState } from "react"
import { CommentItemProps } from "./types"

export default function CommentItem({ 
  comment, 
  getAuthorDisplay, 
  getAvatarUrl, 
  getInitials,
  isAdminOrAuthor,
  currentUserId,
  onApprove,
  onReply,
  onLike,
  onDeny,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const [imageError, setImageError] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)

  return (
    <div className="bg-card dark:bg-gray-900 rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-3">
        {getAvatarUrl(comment.author) && !imageError ? (
          <img
            src={getAvatarUrl(comment.author)!}
            alt={getAuthorDisplay(comment.author)}
            className="w-8 h-8 rounded-full border border-border dark:border-gray-600"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center border border-border dark:border-gray-600">
            <span className="text-blue-300 text-sm font-medium">
              {getInitials(comment.author)}
            </span>
          </div>
        )}
        <div>
          <div className="text-foreground font-medium text-sm">
            {getAuthorDisplay(comment.author)}
          </div>
        </div>
      </div>
      {comment.status === "PENDING" && (
        <div className="mb-2 text-xs italic text-yellow-400">Pending approval</div>
      )}
      {comment.status === "REJECTED" && (isAdminOrAuthor || currentUserId === comment.author.id) && (
        <div className="mb-2 text-xs text-red-500 dark:text-red-400">
          Rejected{comment.moderationNote ? `: ${comment.moderationNote}` : ""}
        </div>
      )}
      {!isEditing ? (
        <p className="text-muted-foreground dark:text-gray-200 text-sm leading-relaxed">{comment.content}</p>
      ) : (
        <div className="mt-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded bg-background text-foreground border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => {
                if (onEdit) {
                  onEdit(editText.trim());
                }
                setIsEditing(false);
              }}
              disabled={!editText.trim()}
              className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded"
            >Save</button>
            <button
              onClick={() => { setIsEditing(false); setEditText(comment.content) }}
              className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
            >Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={onLike}
          className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
        >
          👍 {comment.likeCount ?? 0}
        </button>
      
      {(isAdminOrAuthor && comment.status === "PENDING") || onReply ? (
        <>
          {isAdminOrAuthor && comment.status === "PENDING" && onApprove && (
            <button
              onClick={onApprove}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
            >
              Approve
            </button>
          )}
          {onReply && (
            <button
              onClick={() => setShowReply((v) => !v)}
              className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
            >
              {showReply ? "Cancel" : "Reply"}
            </button>
          )}
        </>
      ) : null}

      {(isAdminOrAuthor && onDeny && comment.status === "PENDING") && (
        <button
          onClick={() => {
            const note = prompt("Enter reason for denial (optional):") || ""
            onDeny(note)
          }}
          className="text-xs bg-red-700 hover:bg-red-600 text-white px-2 py-1 rounded"
        >Deny</button>
      )}

      {((currentUserId === comment.author.id) || isAdminOrAuthor) && onDelete && (
        <button
          onClick={onDelete}
          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
        >Delete</button>
      )}

      {(currentUserId === comment.author.id) && onEdit && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
        >Edit</button>
      )}
      </div>

      {isAdminOrAuthor && onReply && showReply && (
        <div className="mt-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            disabled={!replyText.trim()}
            onClick={() => {
              if (!replyText.trim()) return
              onReply(replyText.trim())
              setReplyText("")
              setShowReply(false)
            }}
            className="mt-2 text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded"
          >
            Post Reply
          </button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 mt-3 space-y-3 border-l-2 border-border dark:border-gray-600 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              getAuthorDisplay={getAuthorDisplay}
              getAvatarUrl={getAvatarUrl}
              getInitials={getInitials}
              isAdminOrAuthor={isAdminOrAuthor}
              currentUserId={currentUserId}
              onApprove={onApprove}
              onReply={onReply ? (content) => onReply(content) : undefined}
              onLike={onLike}
              onDeny={onDeny}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}