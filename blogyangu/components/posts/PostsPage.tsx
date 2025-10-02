import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { FaPlus } from "react-icons/fa"
import { Category } from "@prisma/client"
import { Post, Comment } from "./types"
import { PostService } from "./services/postService"
import LoadingSpinner from "../LoadingSpinner"
import CreatePostModal from "./CreatePostModal"
import PostList from "./PostList"

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null)
  const [commentText, setCommentText] = useState("")
  const [commentsByPost, setCommentsByPost] = useState<Record<number, Comment[]>>({})
  const [loadingComments, setLoadingComments] = useState(false)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
const [imageErrors, setImageErrors] = useState<Record<string | number, boolean>>({});
  const [showModal, setShowModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  useEffect(() => {
    PostService.fetchCategories(setCategories)
  }, [])

  useEffect(() => {
    PostService.fetchPostsAndComments(setPosts, setCommentsByPost, setLoading)
  }, [])

  const handleToggleComments = async (postId: number) => {
    await PostService.toggleComments(
      postId, 
      activeCommentPostId, 
      setActiveCommentPostId, 
      setLoadingComments, 
      setCommentsByPost, 
      setPosts
    )
  }
    

  const handleSubmitComment = async (postId: number) => {
    await PostService.submitComment(
      postId, 
      commentText, 
      session, 
      setCommentsByPost, 
      setCommentText, 
      setActiveCommentPostId, 
      setPosts
    )
  }

  const handleLike = async (postId: number) => {
    await PostService.likePost(postId, session, setPosts)
  }

  const handleDeletePost = async (postId: number) => {
    await PostService.deletePost(postId, setPosts, setCommentsByPost)
  }

  const handleApproveComment = async (commentId: number, postId: number) => {
    await PostService.approveComment(commentId, postId, setCommentsByPost as any, setPosts as any)
  }

  const handleReplyComment = async (postId: number, parentId: number, content: string) => {
    await PostService.submitComment(
      postId,
      content,
      session,
      setCommentsByPost,
      undefined,
      undefined,
      setPosts,
      parentId
    )
  }

  const handleLikeComment = async (commentId: number, postId: number) => {
    await PostService.likeComment(commentId, postId, session, setCommentsByPost)
  }

  const handleDenyComment = async (commentId: number, postId: number, note: string) => {
    await PostService.denyComment(commentId, postId, note, setCommentsByPost)
  }

  const handleEditComment = async (commentId: number, postId: number, content: string) => {
    await PostService.editComment(commentId, postId, content, setCommentsByPost)
  }

  const handleDeleteComment = async (commentId: number, postId: number) => {
    if (!confirm("Delete this comment?")) return
    await PostService.deleteComment(commentId, postId, setCommentsByPost)
  }

const isAdminOrAuthor: boolean = session?.user?.role
  ? ["ADMIN", "AUTHOR"].includes(session.user.role)
  : false

  const filteredPosts = useMemo(() => {
    let arr = [...posts]

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      arr = arr.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt?.toLowerCase().includes(q) ?? false) ||
        (p.author?.displayName?.toLowerCase().includes(q) ?? false) ||
        (p.author?.username?.toLowerCase().includes(q) ?? false)
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "uncategorized") {
        arr = arr.filter(p => !p.category || p.category.id == null)
      } else {
        arr = arr.filter(p => (p.category?.id?.toString() ?? "") === selectedCategory)
      }
    }

    // Sort
    switch (sortBy) {
      case "oldest":
        arr.sort((a, b) => new Date(a.publishedAt ?? 0).getTime() - new Date(b.publishedAt ?? 0).getTime())
        break
      case "mostLiked":
        arr.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
        break
      case "mostCommented":
        arr.sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0))
        break
      case "newest":
      default:
        arr.sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
        break
    }

    return arr
  }, [posts, search, selectedCategory, sortBy])

  if (loading) {
    return <LoadingSpinner message="Loading posts..." />
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Community Posts</h1>
            
            {isAdminOrAuthor && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <FaPlus className="w-4 h-4" />
                <span>Create New Post</span>
              </button>
            )}
          </div>

          <p className="text-muted-foreground text-lg mb-4">Discover insights and discussions from our community</p>
        </header>

        {/* Toolbar */}
        <div className="mb-10 bg-card/60 border border-border rounded-xl p-4 dark:bg-gray-800/60 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, author, or keywords"
                className="w-full bg-background text-foreground placeholder:text-muted-foreground border border-input rounded-lg px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-gray-900 dark:text-white dark:border-gray-700"
              >
                <option value="all">All categories</option>
                <option value="uncategorized">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-gray-900 dark:text-white dark:border-gray-700"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="mostLiked">Most liked</option>
                <option value="mostCommented">Most commented</option>
              </select>
            </div>
          </div>
        </div>

        <PostList
          posts={filteredPosts}
          imageErrors={imageErrors}
          setImageErrors={setImageErrors}
          activeCommentPostId={activeCommentPostId}
          commentText={commentText}
          setCommentText={setCommentText}
          loadingComments={loadingComments}
          commentsByPost={commentsByPost}
          isAdminOrAuthor={isAdminOrAuthor}
          session={session}
          onToggleComments={handleToggleComments}
          onSubmitComment={handleSubmitComment}
          onLike={handleLike}
          onDeletePost={handleDeletePost}
          onApproveComment={handleApproveComment}
          onReplyComment={handleReplyComment}
          onLikeComment={handleLikeComment}
          onDenyComment={handleDenyComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          currentUserId={session?.user?.id ? Number(session.user.id) : undefined}
        />
      </div>

      <CreatePostModal
        showModal={showModal}
        setShowModal={setShowModal}
        categories={categories}
        session={session}
        setPosts={setPosts}
      />
    </div>
  )
}