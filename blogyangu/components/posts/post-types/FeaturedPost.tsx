import Link from "next/link"
import { FaRegThumbsUp, FaRegCommentDots, FaEdit, FaTrash } from "react-icons/fa"
import { PostProps } from "../types"
import CommentSection from "../CommentSection"
import { getAuthorDisplay, getAvatarUrl, getInitials } from "../utils/authorUtils"
import PostContent from "../PostContent"

export default function FeaturedPost({ post, ...props }: PostProps) {
  return (
    <article className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <PostContent 
        post={post} 
        imageHeight="h-96"
        titleSize="text-3xl"
        excerptSize="text-lg"
        showExcerpt={true}
        {...props}
      />
      
      <div className="p-8">
  

        {props.activeCommentPostId === post.id && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <CommentSection post={post} {...props} />
          </div>
        )}

        {props.isAdminOrAuthor && (
          <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-700">
            <Link href={`/posts/edit/${post.id}`}>
              <button className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                <FaEdit className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </Link>
            <button
              onClick={() => props.onDeletePost(post.id)}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <FaTrash className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </article>
  )
}