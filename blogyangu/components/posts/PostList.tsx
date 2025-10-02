import { Session } from "next-auth"
import { getAuthorDisplay, getAvatarUrl, getInitials } from "./utils/authorUtils"
import { Post, Comment } from "./types"
import FeaturedPost from "./post-types/FeaturedPost"
import RowPost from "./post-types/RowPost"
import ColumnPost from "./ColumnPost"
import React from "react"

interface PostsListProps {
  posts: Post[]
  imageErrors: Record<number | string, boolean>
  setImageErrors: React.Dispatch<React.SetStateAction<Record<number | string, boolean>>>
  activeCommentPostId: number | null
  commentText: string
  setCommentText: React.Dispatch<React.SetStateAction<string>>
  loadingComments: boolean
  commentsByPost: Record<number, Comment[]>
  isAdminOrAuthor: boolean
  session: Session | null
  currentUserId?: number
  onToggleComments: (postId: number) => void
  onSubmitComment: (postId: number) => void
  onLike: (postId: number) => void
  onDeletePost: (postId: number) => void
  onApproveComment?: (commentId: number, postId: number) => void
  onReplyComment?: (postId: number, parentId: number, content: string) => void
  onLikeComment?: (commentId: number, postId: number) => void
  onDenyComment?: (commentId: number, postId: number, note: string) => void
  onEditComment?: (commentId: number, postId: number, content: string) => void
  onDeleteComment?: (commentId: number, postId: number) => void
}

export default function PostsList({
  posts,
  imageErrors,
  setImageErrors,
  activeCommentPostId,
  commentText,
  setCommentText,
  loadingComments,
  commentsByPost,
  isAdminOrAuthor,
  session,
  currentUserId,
  onToggleComments, // This is the prop name
  onSubmitComment, // This is the prop name
  onLike, // This is the prop name
  onDeletePost,
  onApproveComment,
  onReplyComment,
  onLikeComment,
  onDenyComment,
  onEditComment,
  onDeleteComment
}: PostsListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-xl">No posts available yet</div>
        <p className="text-gray-400 mt-2">Be the first to share your thoughts!</p>
      </div>
    )
  }

  const featuredPost = posts.length > 0 ? posts[0] : null
  const rowPosts = posts.length > 2 ? posts.slice(1, 3) : posts.slice(1)
  const columnPosts = posts.length > 3 ? posts.slice(3) : []

  const commonProps = {
    imageErrors,
    setImageErrors,
    activeCommentPostId,
    commentText,
    setCommentText,
    loadingComments,
    commentsByPost,
    isAdminOrAuthor,
    session,
    currentUserId,
    onToggleComments, // Use the correct prop name
    onSubmitComment, // Pass through directly
    onLike, // Use the correct prop name
    onDeletePost, // Pass through directly
    onApproveComment,
    onReplyComment,
    onLikeComment,
    onDenyComment,
    onEditComment,
    onDeleteComment,
    getAuthorDisplay,
    getAvatarUrl,
    getInitials
  }

  return (
    <div className="space-y-12">
      {featuredPost && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-border dark:border-gray-700 pb-2">Featured Post</h2>
          <FeaturedPost post={featuredPost} {...commonProps} />
        </section>
      )}

      {rowPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-border dark:border-gray-700 pb-2">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rowPosts.map((post) => (
              <RowPost key={post.id} post={post} {...commonProps} />
            ))}
          </div>
        </section>
      )}

      {columnPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-border dark:border-gray-700 pb-2">More Posts</h2>
          <div className="space-y-8">
            {columnPosts.map((post) => (
              <ColumnPost
                key={post.id}
                post={post}
                {...commonProps}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}


