import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useSession } from "next-auth/react"

interface Author {
  id: number
  displayName: string | null
  username: string
  avatarUrl?: string | null
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

interface Comment {
  id: number
  content: string
  author: Author
  parentId: number | null
  replies: Comment[]
  createdAt: string
}

interface Post {
  id: number
  title: string
  content: string
  excerpt?: string
  slug: string
  coverImage?: string
  status: string
  publishedAt: string | null
  author: Author
  category?: Category
  likeCount: number
  commentCount: number
  bookmarkCount: number
  userLiked: boolean
  userBookmarked: boolean
  tags: Array<{
    tag: Tag
  }>
  allowComments: boolean
  viewCount: number
  metaDescription?: string
}

export default function PostDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (!id) return

    async function fetchPost() {
      try {
        setLoading(true)
        const res = await fetch(`/api/posts/${id}`)
        if (res.ok) {
          const data = await res.json()
          setPost(data)
        } else if (res.status === 404) {
          setError("Post not found")
        } else {
          setError("Failed to load post")
        }
      } catch (err) {
        setError("An error occurred")
        console.error("Error fetching post:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  useEffect(() => {
    if (!id) return

    async function fetchComments() {
      try {
        const res = await fetch(`/api/posts/${id}/comments`)
        if (res.ok) {
          const data = await res.json()
          setComments(data)
        }
      } catch (err) {
        console.error("Error fetching comments:", err)
      }
    }

    fetchComments()
  }, [id])

  const getAuthorDisplay = (author: Author) => {
    return author?.displayName || author?.username || "Unknown Author"
  }

  const getAvatarUrl = (author: Author) => {
    return author?.avatarUrl || null
  }

  const getInitials = (author: Author) => {
    const name = getAuthorDisplay(author)
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2)
  }

  const handleLike = async () => {
    if (!session || !post) {
      alert("Please login to like posts")
      return
    }

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        const result = await res.json()
        setPost({
          ...post,
          userLiked: result.liked,
          likeCount: result.liked ? post.likeCount + 1 : Math.max(0, post.likeCount - 1)
        })
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !post || !newComment.trim()) return

    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
          parentId: replyingTo
        })
      })

      if (res.ok) {
        const comment = await res.json()
        if (replyingTo) {
          setComments(comments.map(c => 
            c.id === replyingTo 
              ? { ...c, replies: [...c.replies, comment] }
              : c
          ))
          setReplyingTo(null)
          setReplyContent("")
        } else {
          setComments([comment, ...comments])
        }
        setNewComment("")
        setPost({ ...post, commentCount: post.commentCount + 1 })
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    }
  }

  const handleSubmitReply = async (parentId: number) => {
    if (!session || !post || !replyContent.trim()) return

    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          parentId
        })
      })

      if (res.ok) {
        const comment = await res.json()
        setComments(comments.map(c => 
          c.id === parentId 
            ? { ...c, replies: [...c.replies, comment] }
            : c
        ))
        setReplyingTo(null)
        setReplyContent("")
        setPost({ ...post, commentCount: post.commentCount + 1 })
      }
    } catch (error) {
      console.error("Error submitting reply:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Post Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "The post you're looking for doesn't exist."}</p>
          <Link 
            href="/posts" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            ← Back to All Posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <Link 
            href="/posts" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Posts
          </Link>
          {post.category && (
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              in <Link href={`/category/${post.category.slug}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">{post.category.name}</Link>
            </span>
          )}
        </nav>

        {/* Article */}
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          {/* Header */}
          <div className="p-8">
            <header>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
                {post.title}
              </h1>
              
              {post.metaDescription && (
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {post.metaDescription}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 border-t border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  {getAvatarUrl(post.author) ? (
                    <img 
                      src={getAvatarUrl(post.author)!} 
                      alt={getAuthorDisplay(post.author)}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                      <span className="text-blue-600 dark:text-blue-300 font-medium text-lg">
                        {getInitials(post.author)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {getAuthorDisplay(post.author)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      )}
                      {post.publishedAt && <span>•</span>}
                      <span>{post.viewCount} views</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${
                      post.userLiked 
                        ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={post.userLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-medium">{post.likeCount}</span>
                  </button>

                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium">{post.commentCount}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && !imageError ? (
              <div className="my-8 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-96 object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : post.coverImage && imageError ? (
              <div className="my-8 rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center h-96">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Unable to load cover image</p>
              </div>
            ) : null}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-700 dark:text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <footer className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(({ tag }) => (
                    <Link 
                      key={tag.id}
                      href={`/tag/${tag.slug}`}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </footer>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Discussion ({post.commentCount})
            </h2>
            {!post.allowComments && (
              <div className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium">
                Comments are disabled
              </div>
            )}
          </div>

          {/* Comment Form */}
          {post.allowComments && (
            <div className="mb-8">
              {session ? (
                <form onSubmit={handleSubmitComment} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-medium text-gray-900 dark:text-gray-100">Add a comment</label>
                    {replyingTo && (
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        Cancel Reply
                      </button>
                    )}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    Post Comment
                  </button>
                </form>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                  <p className="text-blue-800 dark:text-blue-300">
                    Please <Link href="/auth/signin" className="font-semibold hover:underline">login</Link> to join the discussion
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  session={session}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  onSetReplyingTo={setReplyingTo}
                  onSetReplyContent={setReplyContent}
                  onSubmitReply={handleSubmitReply}
                  getAuthorDisplay={getAuthorDisplay}
                  getAvatarUrl={getAvatarUrl}
                  getInitials={getInitials}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  session: any
  replyingTo: number | null
  replyContent: string
  onSetReplyingTo: (id: number | null) => void
  onSetReplyContent: (content: string) => void
  onSubmitReply: (parentId: number) => void
  getAuthorDisplay: (author: Author) => string
  getAvatarUrl: (author: Author) => string | null
  getInitials: (author: Author) => string
}

function CommentItem({ 
  comment, 
  session, 
  replyingTo, 
  replyContent, 
  onSetReplyingTo, 
  onSetReplyContent, 
  onSubmitReply,
  getAuthorDisplay,
  getAvatarUrl,
  getInitials
}: CommentItemProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 pb-6 last:pb-0">
      {/* Main Comment */}
      <div className="flex gap-4">
        {getAvatarUrl(comment.author) && !imageError ? (
          <img 
            src={getAvatarUrl(comment.author)!} 
            alt={getAuthorDisplay(comment.author)}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-600"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0">
            <span className="text-blue-600 dark:text-blue-300 font-medium">
              {getInitials(comment.author)}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {getAuthorDisplay(comment.author)}
            </span>
            <time className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </time>
          </div>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
          {session && (
            <button
              onClick={() => onSetReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="ml-14 mt-4">
          <textarea
            value={replyContent}
            onChange={(e) => onSetReplyContent(e.target.value)}
            placeholder="Write your reply..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none text-sm transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => onSubmitReply(comment.id)}
              disabled={!replyContent.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Post Reply
            </button>
            <button
              onClick={() => onSetReplyingTo(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-14 mt-4 space-y-4 border-l-2 border-gray-100 dark:border-gray-700 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              {getAvatarUrl(reply.author) && !imageError ? (
                <img 
                  src={getAvatarUrl(reply.author)!} 
                  alt={getAuthorDisplay(reply.author)}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-600"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                    {getInitials(reply.author)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {getAuthorDisplay(reply.author)}
                  </span>
                  <time className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}