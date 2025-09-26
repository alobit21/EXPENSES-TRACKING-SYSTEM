import Link from "next/link";
import { FaRegThumbsUp, FaRegCommentDots, FaEdit, FaTrash } from "react-icons/fa";
import CommentSection from "./CommentSection";
import { PostComponentProps } from "@/types/posts";

export default function ColumnPost({
  post,
  imageErrors = {},
  setImageErrors = () => {},
  onLike = () => {},
  onToggleComments = () => {},
  activeCommentPostId = null,
  commentText = "",
  setCommentText = () => {},
  handleSubmitComment = () => {},
  loadingComments = false,
  commentsByPost = {},
  isAdminOrAuthor = false,
  handleDeletePost = () => {},
  getAuthorDisplay = (author: any) => author?.displayName || author?.username || "Unknown",
  getAvatarUrl = () => null,
  getInitials = (author: any) => (author?.displayName || author?.username || "U").charAt(0).toUpperCase(),
  session = null,
}: PostComponentProps) {

  return (
    <article className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row h-full">
      
      {/* Left Image */}
      <div className="sm:w-2/5 md:w-1/3 lg:w-2/5 flex-shrink-0">
        {/* Fixed Aspect Ratio */}
        <div className="relative w-full h-48 sm:h-full bg-gray-800 flex items-center justify-center overflow-hidden">
          {post.coverImage && !imageErrors[post.id] ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageErrors(prev => ({ ...prev, [post.id]: true }))}
            />
          ) : post.coverImage && imageErrors[post.id] ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
              <p className="text-gray-400 text-sm">Image failed to load</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-700">
              <div className="text-center text-gray-400">
                <div className="text-3xl mb-1">📷</div>
                <p className="text-xs">No image available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col min-w-0">
        
        {/* Category */}
        {post.category && (
          <span className="inline-block bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded-full mb-2 font-semibold uppercase">
            {post.category.name}
          </span>
        )}

        {/* Title */}
        <Link href={`/posts/${post.slug}`} className="group mb-2">
          <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 line-clamp-2 leading-tight">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-300 text-sm mb-3 line-clamp-3 flex-grow">
          {post.excerpt || "No excerpt available."}
        </p>

        {/* Author & Stats */}
        <div className="flex items-center justify-between mt-auto space-x-3">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {getAvatarUrl(post.author) && !imageErrors[`author-${post.author.id}`] ? (
              <img
                src={getAvatarUrl(post.author)!}
                alt={getAuthorDisplay(post.author)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-600 flex-shrink-0"
                onError={() =>
                  setImageErrors(prev => ({ ...prev, [`author-${post.author.id}`]: true }))
                }
              />
            ) : (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-900 flex items-center justify-center border border-gray-600 flex-shrink-0">
                <span className="text-blue-300 text-xs font-medium">
                  {getInitials(post.author)}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-white text-sm font-medium truncate">
                {getAuthorDisplay(post.author)}
              </div>
              {post.publishedAt && (
                <div className="text-gray-400 text-xs">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Like & Comments */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 text-xs transition-colors p-1"
              title="Like post"
            >
              <FaRegThumbsUp className="w-3 h-3" />
              <span>{post.likeCount}</span>
            </button>
            <button
              onClick={() => onToggleComments(post.id)}
              className="flex items-center space-x-1 text-gray-400 hover:text-green-400 text-xs transition-colors p-1"
              title="View comments"
            >
              <FaRegCommentDots className="w-3 h-3" />
              <span>{post.commentCount}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {activeCommentPostId === post.id && (
          <div className="mt-3 border-t border-gray-700 pt-3">
            <CommentSection
              post={post}
              commentText={commentText}
              setCommentText={setCommentText}
              onSubmitComment={handleSubmitComment}
              loadingComments={loadingComments}
              commentsByPost={commentsByPost}
              imageErrors={imageErrors}
              setImageErrors={setImageErrors}
              activeCommentPostId={activeCommentPostId}
              isAdminOrAuthor={isAdminOrAuthor}
              session={session}
              onToggleComments={onToggleComments}
              onLike={onLike}
              onDeletePost={handleDeletePost}
              getAuthorDisplay={getAuthorDisplay}
              getAvatarUrl={getAvatarUrl}
              getInitials={getInitials}
            />
          </div>
        )}

        {/* Admin Actions */}
        {isAdminOrAuthor && (
          <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-700">
            <Link href={`/posts/edit/${post.id}`} className="flex-1">
              <button className="flex items-center justify-center space-x-1 bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-0.5 rounded text-xs w-full">
                <FaEdit className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </Link>
            <button
              onClick={() => handleDeletePost(post.id)}
              className="flex-1 flex items-center justify-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-xs"
            >
              <FaTrash className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        )}

      </div>
    </article>
  );
}
