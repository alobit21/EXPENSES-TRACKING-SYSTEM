import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { FaPlus } from "react-icons/fa"
import { Category, Post as PostType } from "@prisma/client"
import { PostService } from "./services/postService"
import LoadingSpinner from "../LoadingSpinner"
import CreatePostModal from "./CreatePostModal"
import PostList from "./PostList"

export default function PostsPage() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null)
  const [commentText, setCommentText] = useState("")
  const [commentsByPost, setCommentsByPost] = useState<Record<number, Comment[]>>({})
  const [loadingComments, setLoadingComments] = useState(false)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
const [imageErrors, setImageErrors] = useState<Record<string | number, boolean>>({});
  const [showModal, setShowModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

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

const isAdminOrAuthor: boolean = session?.user?.role
  ? ["ADMIN", "AUTHOR"].includes(session.user.role)
  : false

  if (loading) {
    return <LoadingSpinner message="Loading posts..." />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Community Posts</h1>
            
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

          <p className="text-gray-400 text-lg mb-4">Discover insights and discussions from our community</p>
        </header>

        <PostList
          posts={posts}
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