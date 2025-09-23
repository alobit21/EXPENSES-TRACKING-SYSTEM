import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { FaRegThumbsUp, FaRegCommentDots, FaEdit, FaTrash } from "react-icons/fa"

interface Author {
  id: number
  displayName: string | null
  username: string
  avatarUrl?: string | null
}

interface Comment {
  id: number
  content: string
  author: Author
  replies?: Comment[]
}

interface Post {
  id: number
  title: string
  excerpt?: string
  slug: string
  coverImage?: string
  author: Author
  publishedAt: string | null
  likeCount: number
  commentCount: number
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null)
  const [commentText, setCommentText] = useState("")
  const [commentsByPost, setCommentsByPost] = useState<Record<number, Comment[]>>({})
  const [loadingComments, setLoadingComments] = useState(false)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const [imageErrors, setImageErrors] = useState<Record<number | string, boolean>>({})

  useEffect(() => {
    async function fetchPostsAndCounts() {
      try {
        setLoading(true)
        const res = await fetch("/api/posts")
        if (res.ok) {
          const data = await res.json()
          // Initialize posts with default counts
          const postsWithCounts = data.map((post: Post) => ({
            ...post,
            likeCount: post.likeCount || 0,
            commentCount: post.commentCount || 0,
          }))
          setPosts(postsWithCounts)

          // Fetch comments for all posts to ensure commentCount is accurate
          const commentPromises = postsWithCounts.map(async (post: Post) => {
            try {
              const commentRes = await fetch(`/api/posts/${post.id}/comments`)
              if (commentRes.ok) {
                const comments = await commentRes.json()
                setCommentsByPost((prev) => ({ ...prev, [post.id]: comments }))
                return { id: post.id, commentCount: comments.length }
              }
              return { id: post.id, commentCount: 0 }
            } catch (error) {
              console.error(`Failed to fetch comments for post ${post.id}:`, error)
              return { id: post.id, commentCount: 0 }
            }
          })

          const commentCounts = await Promise.all(commentPromises)
          setPosts((prev) =>
            prev.map((p) => {
              const countData = commentCounts.find((c) => c.id === p.id)
              return { ...p, commentCount: countData?.commentCount || p.commentCount }
            })
          )
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPostsAndCounts()
  }, [])

  const handleToggleComments = async (postId: number) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null)
      return
    }

    setActiveCommentPostId(postId)
    setLoadingComments(true)

    try {
      const res = await fetch(`/api/posts/${postId}/comments`)
      if (res.ok) {
        const data = await res.json()
        setCommentsByPost((prev) => ({ ...prev, [postId]: data }))
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, commentCount: data.length } : p
          )
        )
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleSubmitComment = async (postId: number) => {
    if (!commentText.trim()) return

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({ content: commentText }),
      })

      if (res.ok) {
        const newComment = await res.json()
        setCommentsByPost((prev) => ({
          ...prev,
          [postId]: [newComment, ...(prev[postId] || [])],
        }))
        setCommentText("")
        setActiveCommentPostId(null)
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, commentCount: (p.commentCount || 0) + 1 }
              : p
          )
        )
      } else {
        const error = await res.json()
        throw new Error(error?.error || "Failed to post comment")
      }
    } catch (err) {
      console.error("Comment error:", err)
      alert(err instanceof Error ? err.message : "Something went wrong while posting your comment.")
    }
  }

  const handleLike = async (postId: number) => {
    if (!session) {
      alert("Please login to like posts")
      return
    }

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({ postId }),
      })

      if (res.ok) {
        const data = await res.json()
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likeCount: data.liked
                    ? (p.likeCount || 0) + 1
                    : Math.max((p.likeCount || 0) - 1, 0),
                }
              : p
          )
        )
      }
    } catch (error) {
      console.error("Like error:", error)
    }
  }

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" })
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postId))
        setCommentsByPost((prev) => {
          const updated = { ...prev }
          delete updated[postId]
          return updated
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete post")
    }
  }

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

  const isAdminOrAuthor = session?.user?.role && ["ADMIN", "AUTHOR"].includes(session.user.role)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Community Posts</h1>
          <p className="text-gray-400 text-lg">Discover insights and discussions from our community</p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl">No posts available yet</div>
            <p className="text-gray-400 mt-2">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                {post.coverImage && !imageErrors[post.id] ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={() => setImageErrors((prev) => ({ ...prev, [post.id]: true }))}
                    />
                  </div>
                ) : post.coverImage && imageErrors[post.id] ? (
                  <div className="relative h-48 overflow-hidden bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-400 text-lg">Unable to load image</p>
                  </div>
                ) : null}
                
                <div className="p-6">
                  <Link href={`/posts/${post.id}`} className="group">
                    <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-gray-300 mt-3 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt || "No excerpt provided."}
                  </p>
                  
                  <div className="flex items-center mt-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      {getAvatarUrl(post.author) && !imageErrors[`author-${post.author.id}`] ? (
                        <img
                          src={getAvatarUrl(post.author)!}
                          alt={getAuthorDisplay(post.author)}
                          className="w-6 h-6 rounded-full border border-gray-600"
                          onError={() => setImageErrors((prev) => ({ ...prev, [`author-${post.author.id}`]: true }))}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center border border-gray-600">
                          <span className="text-blue-300 text-xs font-medium">
                            {getInitials(post.author)}
                          </span>
                        </div>
                      )}
                      <span>{getAuthorDisplay(post.author)}</span>
                    </div>
                    {post.publishedAt && (
                      <span className="ml-4">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      <FaRegThumbsUp className="w-4 h-4" />
                      <span>{post.likeCount}</span>
                    </button>

                    <button
                      onClick={() => handleToggleComments(post.id)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors duration-200"
                    >
                      <FaRegCommentDots className="w-4 h-4" />
                      <span>{post.commentCount}</span>
                    </button>
                  </div>

                  {activeCommentPostId === post.id && (
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={3}
                        placeholder="Share your thoughts..."
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      />
                      
                      <button
                        onClick={() => handleSubmitComment(post.id)}
                        disabled={!commentText.trim()}
                        className="mt-3 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        Post Comment
                      </button>

                      <div className="mt-6 space-y-4">
                        {loadingComments ? (
                          <div className="text-center text-gray-400 py-4">Loading comments...</div>
                        ) : commentsByPost[post.id]?.length === 0 ? (
                          <div className="text-center text-gray-400 py-4">
                            No comments yet. Be the first to comment!
                          </div>
                        ) : (
                          commentsByPost[post.id].map((comment) => (
                            <CommentItem 
                              key={comment.id} 
                              comment={comment} 
                              getAuthorDisplay={getAuthorDisplay} 
                              getAvatarUrl={getAvatarUrl} 
                              getInitials={getInitials} 
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {isAdminOrAuthor && (
                    <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-700">
                      <Link href={`/posts/edit/${post.id}`}>
                        <button className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                          <FaEdit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <FaTrash className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  getAuthorDisplay: (author: Author) => string
  getAvatarUrl: (author: Author) => string | null
  getInitials: (author: Author) => string
}

function CommentItem({ comment, getAuthorDisplay, getAvatarUrl, getInitials }: CommentItemProps) {
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