// pages/posts/[id].tsx
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import { Post, User, Comment as PrismaComment, Like } from '@prisma/client'
import { Session } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import { FaRegThumbsUp, FaThumbsUp, FaRegComment, FaEdit, FaTrash, FaArrowLeft, FaReply } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import ReactMarkdown from 'react-markdown'
import * as Showdown from "showdown"

// Types matching your backend response
interface Author {
  id: number
  username: string
  displayName: string | null
  avatarUrl: string | null
}

interface Comment {
  id: number
  content: string
  createdAt: string
  author: Author
  parentId: number | null
  replies: Comment[]
  _count: {
    likes: number
  }
}

interface PostWithExtras {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  publishedAt: Date | null
  author: Author
  category: { id: number; name: string } | null
  likeCount: number
  commentCount: number
  likes: Like[]
}

interface PostLite {
  id: number
  title: string
  slug: string
  coverImage: string | null
  likeCount?: number
  commentCount?: number
}

interface Props {
  post: PostWithExtras
  initialComments: Comment[]
  relatedPosts: PostLite[]
  trendingPosts: PostLite[]
  mostLikedPosts: PostLite[]
  mostCommentedPosts: PostLite[]
  latestPosts: PostLite[]
}

export default function PostDetail({ post, initialComments, relatedPosts, trendingPosts, mostLikedPosts, mostCommentedPosts, latestPosts }: Props) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [imageError, setImageError] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>(initialComments || [])
  const [likes, setLikes] = useState<Like[]>(post.likes || [])
  const [isLiking, setIsLiking] = useState(false)
const converter = new Showdown.Converter()

  // Check if current user has liked the post
  const userLike = session ? likes.find(like => like.userId === parseInt(session.user.id)) : null
  const likeCount = likes.length

  // Check if user is admin or author
  const isAdminOrAuthor = session?.user?.id && 
    (session.user.role === 'ADMIN' || parseInt(session.user.id) === post.author.id)
  
  
  
  
  

  // Format date
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Not published'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Handle like/unlike using your existing API
  const handleLike = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setIsLiking(true)
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.id}`
        },
        body: JSON.stringify({ postId: post.id })
      })

      if (response.ok) {
        const result = await response.json()
        
        if (result.liked) {
          // Add like to local state
          setLikes(prev => [...prev, {
            id: Date.now(), // Temporary ID
            userId: parseInt(session.user.id),
            postId: post.id,
            commentId: null,
            createdAt: new Date()
          }])
        } else {
          // Remove like from local state
          setLikes(prev => prev.filter(like => 
            !(like.userId === parseInt(session.user.id) && like.postId === post.id)
          ))
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !commentText.trim()) return

    setLoadingComments(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.id}`
        },
        body: JSON.stringify({ content: commentText })
      })

      if (response.ok) {
        const newComment = await response.json()
        setComments(prev => [newComment, ...prev])
        setCommentText('')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  // Handle reply submission
  const handleSubmitReply = async (parentId: number) => {
    if (!session || !replyText.trim()) return

    setLoadingComments(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.id}`
        },
        body: JSON.stringify({ 
          content: replyText,
          parentId: parentId
        })
      })

      if (response.ok) {
        const newReply = await response.json()
        // Update the parent comment with the new reply
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
? { ...comment, replies: [...(comment.replies || []), newReply] }            : comment
        ))
        setReplyText('')
        setReplyingTo(null)
      }
    } catch (error) {
      console.error('Error submitting reply:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  // Handle post deletion
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.user.id}`
        }
      })

      if (response.ok) {
        router.push('/')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/posts"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Posts</span>
        </Link>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article */}
          <article className="lg:col-span-8">
            {/* Header */}
            <header className="mb-8">
              {post.category && (
                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {post.category.name}
                </span>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-300 mb-6">{post.excerpt}</p>
          )}

          {/* Author and Date */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {post.author.avatarUrl && !imageError ? (
                  <Image
                    src={post.author.avatarUrl}
                    alt={post.author.displayName || post.author.username}
                    width={48}
                    height={48}
                    className="rounded-full"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-12 h-12 bg-secondary dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {(post.author.displayName || post.author.username).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-semibold">
                    {post.author.displayName || post.author.username}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {formatDate(post.publishedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Like and Comment Count */}
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                disabled={isLiking || !session}
                className={`flex items-center space-x-2 ${
                  userLike ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                } transition-colors ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={!session ? 'Please sign in to like' : ''}
              >
                {userLike ? <FaThumbsUp className="w-5 h-5" /> : <FaRegThumbsUp className="w-5 h-5" />}
                <span>{likeCount}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <FaRegComment className="w-5 h-5" />
                <span>{comments.length}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && !imageError && (
          <div className="mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          </div>
        )}

      {/* Content */}

<div
  className="prose prose-lg max-w-none mb-12 dark:prose-invert [&_img]:max-w-xs [&_img]:mx-auto [&_img]:rounded-lg"
  dangerouslySetInnerHTML={{ __html: converter.makeHtml(post.content) }}
/>



        {/* Actions (Edit/Delete for authors/admins) */}
        {isAdminOrAuthor && (
          <div className="flex space-x-4 mb-8 pt-6 border-t border-border dark:border-gray-700">
            <Link href={`/posts/edit/${post.slug}`}>
              <button className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors">
                <FaEdit className="w-4 h-4" />
                <span>Edit Post</span>
              </button>
            </Link>
            <button 
              onClick={handleDelete}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaTrash className="w-4 h-4" />
              <span>Delete Post</span>
            </button>
          </div>
        )}

        {/* Comments Section */}
        <section className="border-t border-border dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

          {/* Comment Form - Only show if user is logged in */}
          {session ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-semibold">{session.user.name || session.user.email}</div>
                  <div className="text-muted-foreground text-sm">Add a comment...</div>
                </div>
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What are your thoughts?"
                rows={4}
                className="w-full bg-background border border-input rounded-lg p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                disabled={loadingComments}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!commentText.trim() || loadingComments}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {loadingComments ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 border border-border dark:border-gray-700 rounded-lg mb-8">
              <p className="text-muted-foreground mb-4">Please sign in to leave a comment</p>
              <Link href="/auth/signin">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Sign In
                </button>
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  session={session}
                  postId={post.id}
                  onReply={() => setReplyingTo(comment.id)}
                  isReplying={replyingTo === comment.id}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  onSubmitReply={handleSubmitReply}
                  onCancelReply={() => {
                    setReplyingTo(null)
                    setReplyText('')
                  }}
                />
              ))
            )}
          </div>
        </section>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-6 space-y-6 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
              {relatedPosts.length > 0 && (
                <SidebarSection title="Related Posts" items={relatedPosts} />
              )}
              {trendingPosts.length > 0 && (
                <SidebarSection title="Trending" items={trendingPosts} />
              )}
              {mostLikedPosts.length > 0 && (
                <SidebarSection title="Most Liked" items={mostLikedPosts} />
              )}
              {mostCommentedPosts.length > 0 && (
                <SidebarSection title="Most Commented" items={mostCommentedPosts} />
              )}
              {latestPosts.length > 0 && (
                <SidebarSection title="Latest" items={latestPosts} />
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

// Comment component with reply functionality
function SidebarSection({ title, items }: { title: string; items: PostLite[] }) {
  return (
    <section className="bg-card border border-border rounded-xl p-4 dark:bg-gray-900 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            {p.coverImage ? (
              <Image
                src={p.coverImage}
                alt={p.title}
                width={64}
                height={40}
                className="w-16 h-10 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-10 bg-secondary dark:bg-gray-900 rounded flex items-center justify-center text-muted-foreground dark:text-gray-400 text-xs">
                No image
              </div>
            )}
            <div className="min-w-0">
              <Link href={`/posts/${p.slug}`} className="block truncate text-sm text-foreground hover:text-blue-600 dark:hover:text-blue-400">
                {p.title}
              </Link>
              <div className="text-xs text-muted-foreground dark:text-gray-400 flex gap-3">
                <span>👍 {p.likeCount ?? 0}</span>
                <span>💬 {p.commentCount ?? 0}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Comment component with reply functionality
function CommentItem({ 
  comment, 
  session, 
  postId, 
  onReply,
  isReplying,
  replyText,
  setReplyText,
  onSubmitReply,
  onCancelReply
}: { 
  comment: Comment
  session: Session | null
  postId: number
  onReply: () => void
  isReplying: boolean
  replyText: string
  setReplyText: (text: string) => void
  onSubmitReply: (parentId: number) => void
  onCancelReply: () => void
}) {
  const [commentLikes, setCommentLikes] = useState<Like[]>([])
  const [isLiking, setIsLiking] = useState(false)

  const userLike = session ? commentLikes.find(like => like.userId === parseInt(session.user.id)) : null

  const handleCommentLike = async () => {
    if (!session) return

    setIsLiking(true)
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.id}`
        },
        body: JSON.stringify({ commentId: comment.id, postId })
      })

      if (response.ok) {
        const result = await response.json()
        // Update local likes state
        if (result.liked) {
          setCommentLikes(prev => [...prev, {
            id: Date.now(),
            userId: parseInt(session.user.id),
            commentId: comment.id,
            postId: null,
            createdAt: new Date()
          }])
        } else {
          setCommentLikes(prev => prev.filter(like => 
            !(like.userId === parseInt(session.user.id) && like.commentId === comment.id)
          ))
        }
      }
    } catch (error) {
      console.error('Error toggling comment like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div className="bg-card dark:bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {comment.author.avatarUrl ? (
            <Image
              src={comment.author.avatarUrl}
              alt={comment.author.displayName || comment.author.username}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-secondary dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {(comment.author.displayName || comment.author.username).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="font-semibold">
              {comment.author.displayName || comment.author.username}
            </div>
            <div className="text-muted-foreground text-sm">
              {formatDate(comment.createdAt)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCommentLike}
            disabled={isLiking || !session}
            className={`flex items-center space-x-1 ${
              userLike ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            } transition-colors ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!session ? 'Please sign in to like' : ''}
          >
            {userLike ? <FaThumbsUp className="w-4 h-4" /> : <FaRegThumbsUp className="w-4 h-4" />}
<span className="text-sm">{comment._count?.likes || 0}</span>          </button>
          
          {session && (
            <button
              onClick={onReply}
              className="flex items-center space-x-1 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FaReply className="w-3 h-3" />
              <span className="text-sm">Reply</span>
            </button>
          )}
        </div>
      </div>
      
      <p className="text-muted-foreground dark:text-gray-300 mb-4">{comment.content}</p>

      {/* Reply Form */}
      {isReplying && session && (
        <div className="ml-6 mt-4">
          <div className="flex items-center space-x-3 mb-2">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-primary dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white dark:text-white text-xs font-semibold">
                  {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="text-sm text-muted-foreground dark:text-gray-400">Replying as {session.user.name || session.user.email}</div>
          </div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            className="w-full bg-background dark:bg-gray-700 border border-input rounded-lg p-3 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => onSubmitReply(comment.id)}
              disabled={!replyText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Post Reply
            </button>
            <button
              onClick={onCancelReply}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="ml-6 mt-4 space-y-4">
          {(comment.replies || []).map((reply) => (
            <div key={reply.id} className="bg-card dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                {reply.author.avatarUrl ? (
                  <Image
                    src={reply.author.avatarUrl}
                    alt={reply.author.displayName || reply.author.username}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">
                      {(reply.author.displayName || reply.author.username).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm">
                    {reply.author.displayName || reply.author.username}
                  </div>
                  <div className="text-muted-foreground text-xs dark:text-gray-400">
                    {formatDate(reply.createdAt)}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground dark:text-gray-300 text-sm">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Re-add formatDate function for CommentItem
function formatDate(date: Date | string | null) {
  if (!date) return 'Unknown date'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  const { id } = context.params!

  try {
    const slug = id as string

    // Fetch post by slug
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        likes: true,
        category: true,
        _count: {
          select: {
            comments: {
              where: { status: 'APPROVED' }
            }
          }
        }
      },
    })

    if (!post) {
      return { notFound: true }
    }

    // Fetch comments separately using your API logic
    const comments = await prisma.comment.findMany({
      where: {
        postId: post.id,
        status: 'APPROVED',
        parentId: null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: { likes: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Sidebar datasets
    const [relatedPostsRaw, trendingPostsRaw, mostLikedRaw, mostCommentedRaw, latestPostsRaw] = await Promise.all([
      prisma.post.findMany({
        where: post.categoryId
          ? { id: { not: post.id }, categoryId: post.categoryId }
          : { id: { not: post.id } },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        include: { _count: { select: { comments: true, likes: true } } }
      }),
      prisma.post.findMany({
        where: { id: { not: post.id } },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        include: { _count: { select: { comments: true, likes: true } } }
      }),
      prisma.post.findMany({
        where: { id: { not: post.id } },
        orderBy: { likes: { _count: 'desc' } },
        take: 5,
        include: { _count: { select: { comments: true, likes: true } } }
      }),
      prisma.post.findMany({
        where: { id: { not: post.id } },
        orderBy: { comments: { _count: 'desc' } },
        take: 5,
        include: { _count: { select: { comments: true, likes: true } } }
      }),
      prisma.post.findMany({
        where: { id: { not: post.id } },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        include: { _count: { select: { comments: true, likes: true } } }
      })
    ])

    const mapLite = (arr: any[]): PostLite[] =>
      arr.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        coverImage: p.coverImage,
        likeCount: p._count?.likes ?? 0,
        commentCount: p._count?.comments ?? 0,
      }))

    const relatedPosts = mapLite(relatedPostsRaw)
    const trendingPosts = mapLite(trendingPostsRaw)
    const mostLikedPosts = mapLite(mostLikedRaw)
    const mostCommentedPosts = mapLite(mostCommentedRaw)
    const latestPosts = mapLite(latestPostsRaw)

    const postWithExtras: PostWithExtras = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      author: post.author ? {
        id: post.author.id,
        username: post.author.username,
        displayName: post.author.displayName,
        avatarUrl: post.author.avatarUrl,
      } : { id: 0, username: "unknown", displayName: "Unknown", avatarUrl: null },
      category: post.category ? { id: post.category.id, name: post.category.name } : null,
      likeCount: post.likes.length,
      commentCount: post._count.comments,
      likes: post.likes,
    }

    return {
      props: {
        post: JSON.parse(JSON.stringify(postWithExtras)),
        initialComments: JSON.parse(JSON.stringify(comments)),
        relatedPosts: JSON.parse(JSON.stringify(relatedPosts)),
        trendingPosts: JSON.parse(JSON.stringify(trendingPosts)),
        mostLikedPosts: JSON.parse(JSON.stringify(mostLikedPosts)),
        mostCommentedPosts: JSON.parse(JSON.stringify(mostCommentedPosts)),
        latestPosts: JSON.parse(JSON.stringify(latestPosts)),
      },
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return { notFound: true }
  }
}