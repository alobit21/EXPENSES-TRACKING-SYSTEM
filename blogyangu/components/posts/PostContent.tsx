import Link from "next/link"
import Image from "next/image"
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
  const getCategoryClasses = (name?: string | null) => {
    if (!name) return "bg-secondary text-muted-foreground dark:bg-gray-700 dark:text-gray-300"
    const key = name.toLowerCase()
    if (/(news|general|community)/.test(key)) return "bg-blue-900 text-blue-300"
    if (/(guide|how|tutorial|docs)/.test(key)) return "bg-green-900 text-green-300"
    if (/(design|ui|ux|creative)/.test(key)) return "bg-pink-900 text-pink-300"
    if (/(dev|code|engineering|tech)/.test(key)) return "bg-indigo-900 text-indigo-300"
    if (/(product|update|release)/.test(key)) return "bg-amber-900 text-amber-300"
    return "bg-purple-900 text-purple-300"
  }
  
  return (
    <>
      {showImage && post.coverImage && !imageErrors[post.id] ? (
        <div className={`relative ${imageHeight} overflow-hidden`}>
          <Image
            src={post.coverImage}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageErrors((prev) => ({ ...prev, [post.id]: true }))}
          />
        </div>
      ) : showImage && post.coverImage && imageErrors[post.id] ? (
        <div className={`relative ${imageHeight} overflow-hidden bg-secondary dark:bg-gray-700 flex items-center justify-center`}>
          <p className="text-muted-foreground dark:text-gray-400">Unable to load image</p>
        </div>
      ) : null}
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-3">
          <span className={`inline-block ${getCategoryClasses(post.category?.name)} text-xs px-2 py-1 rounded-full`}>
            {post.category?.name || "Uncategorized"}
          </span>
        </div>

        <Link href={`/posts/${post.slug}`} className="group mb-3">
          <h3 className={`${titleSize} font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2`}>
            {post.title}
          </h3>
        </Link>

        {showExcerpt && (
          <p className={`${excerptSize} text-muted-foreground dark:text-gray-300 leading-relaxed line-clamp-3 mb-4 flex-grow`}>
            {post.excerpt || "No excerpt provided."}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getAvatarUrl(post.author) && !imageErrors[`author-${post.author.id}`] ? (
              <Image
                src={getAvatarUrl(post.author)!}
                alt={getAuthorDisplay(post.author)}
                width={24}
                height={24}
                className="rounded-full border border-border dark:border-gray-600"
                onError={() =>
                  setImageErrors((prev) => ({ ...prev, [`author-${post.author.id}`]: true }))
                }
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center border border-border dark:border-gray-600">
                <span className="text-blue-300 text-xs font-medium">
                  {getInitials(post.author)}
                </span>
              </div>
            )}
            <div>
              <div className="text-foreground text-sm">
                {getAuthorDisplay(post.author)}
              </div>
              {post.publishedAt && (
                <div className="text-muted-foreground text-xs">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center space-x-1 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <FaRegThumbsUp className="w-4 h-4" />
              <span className="text-sm">{post.likeCount}</span>
            </button>

            <button
              onClick={() => onToggleComments(post.id)}
              className="flex items-center space-x-1 text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
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