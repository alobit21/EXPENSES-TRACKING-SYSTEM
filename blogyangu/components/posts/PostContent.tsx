import Link from "next/link"
import { FaRegThumbsUp, FaRegCommentDots } from "react-icons/fa"
import { PostProps } from "./types"
import { getAuthorDisplay, getAvatarUrl, getInitials } from "./utils/authorUtils"

interface PostContentProps extends PostProps {
  imageHeight?: string
  titleSize?: string
  excerptSize?: string
  showImage?: boolean
  showExcerpt?: boolean
}

export default function PostContent({ 
  post, 
  imageHeight = "h-64", 
  titleSize = "text-xl", 
  excerptSize = "text-sm",
  showImage = true,
  showExcerpt = false,
  imageErrors,
  setImageErrors,
  onLike,
  onToggleComments
}: PostContentProps) {

    
  return (
    <>
      {showImage && post.coverImage && !imageErrors[post.id] ? (
        <div className={`relative ${imageHeight} overflow-hidden`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageErrors((prev) => ({ ...prev, [post.id]: true }))}
          />
        </div>
      ) : showImage && post.coverImage && imageErrors[post.id] ? (
        <div className={`relative ${imageHeight} overflow-hidden bg-gray-700 flex items-center justify-center`}>
          <p className="text-gray-400">Unable to load image</p>
        </div>
      ) : null}
      
      <div className="p-6 flex-grow flex flex-col">
        {post.category && (
          <div className="mb-3">
            <span className="inline-block bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-full">
              {post.category.name}
            </span>
          </div>
        )}

        <Link href={`/posts/${post.id}`} className="group mb-3">
          <h3 className={`${titleSize} font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 line-clamp-2`}>
            {post.title}
          </h3>
        </Link>

        {showExcerpt && (
          <p className={`${excerptSize} text-gray-300 leading-relaxed line-clamp-3 mb-4 flex-grow`}>
            {post.excerpt || "No excerpt provided."}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getAvatarUrl(post.author) && !imageErrors[`author-${post.author.id}`] ? (
              <img
                src={getAvatarUrl(post.author)!}
                alt={getAuthorDisplay(post.author)}
                className="w-6 h-6 rounded-full border border-gray-600"
                onError={() =>
                  setImageErrors((prev) => ({ ...prev, [`author-${post.author.id}`]: true }))
                }
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center border border-gray-600">
                <span className="text-blue-300 text-xs font-medium">
                  {getInitials(post.author)}
                </span>
              </div>
            )}
            <div>
              <div className="text-white text-sm">
                {getAuthorDisplay(post.author)}
              </div>
              {post.publishedAt && (
                <div className="text-gray-400 text-xs">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <FaRegThumbsUp className="w-4 h-4" />
              <span className="text-sm">{post.likeCount}</span>
            </button>

            <button
              onClick={() => onToggleComments(post.id)}
              className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors duration-200"
            >
              <FaRegCommentDots className="w-4 h-4" />
              <span className="text-sm">{post.commentCount}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}