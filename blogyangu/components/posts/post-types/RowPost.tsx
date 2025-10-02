import Link from "next/link"
import { FaEdit, FaTrash } from "react-icons/fa"
import { PostProps } from "../types"
import PostContent from "../PostContent"
import CommentSection from "../CommentSection"
export default function RowPost({ post, ...props }: PostProps) {
  return (
    <article className="bg-card dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-border dark:border-gray-700">
      <PostContent 
        post={post}
        imageHeight="h-64"
        titleSize="text-xl"
        excerptSize="text-sm"
        showExcerpt={true}
        showImage={true}
        {...props}
      />
      
      <div className="p-6 flex-grow flex flex-col">
        

        {props.activeCommentPostId === post.id && (
          <div className="mt-4 pt-4 border-t border-border dark:border-gray-700">
            <CommentSection post={post} {...props} />
          </div>
        )}

        {props.isAdminOrAuthor && (
          <div className="flex space-x-2 mt-4 pt-4 border-t border-border dark:border-gray-700">
            <Link href={`/posts/edit/${post.id}`}>
              <button className="flex items-center space-x-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                <FaEdit className="w-3 h-3" />
                <span>Edit</span>
              </button>
              
            </Link>
            <button
              onClick={() => props.onDeletePost(post.id)}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
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