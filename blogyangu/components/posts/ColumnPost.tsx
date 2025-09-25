import Link from "next/link";
import { FaRegThumbsUp, FaRegCommentDots, FaEdit, FaTrash } from "react-icons/fa";
import CommentSection from "./CommentSection";
import { PostComponentProps } from "@/types/posts";

export default function ColumnPost({
  post,
  imageErrors,
  setImageErrors,
  handleLike,
  handleToggleComments,
  activeCommentPostId,
  commentText,
  setCommentText,
  handleSubmitComment,
  loadingComments,
  commentsByPost,
  isAdminOrAuthor,
  handleDeletePost,
  getAuthorDisplay,
  getAvatarUrl,
  getInitials,
  session,
}: PostComponentProps) {
  return (
    <article className="bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300">
      {post.coverImage && !imageErrors[post.id] ? (
        <div className="relative h-64 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageErrors(prev => ({ ...prev, [post.id]: true }))}
          />
        </div>
      ) : post.coverImage && imageErrors[post.id] ? (
        <div className="h-64 bg-gray-700 flex items-center justify-center">
          <p className="text-gray-400">Unable to load image</p>
        </div>
      ) : null}

      <div className="p-6">
        {post.category && (
          <span className="inline-block bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full mb-3">
            {post.category.name}
          </span>
        )}

        <Link href={`/posts/${post.slug}`} className="group">
          <h2 className="text-xl font-bold text-white group-hover:text-blue-400 mb-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-300 text-sm mb-4">
          {post.excerpt || "No excerpt provided."}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getAvatarUrl(post.author) && !imageErrors[`author-${post.author.id}`] ? (
              <img
                src={getAvatarUrl(post.author)!}
                alt={getAuthorDisplay(post.author)}
                className="w-8 h-8 rounded-full border border-gray-600"
                onError={() =>
                  setImageErrors(prev => ({ ...prev, [`author-${post.author.id}`]: true }))
                }
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center border border-gray-600">
                <span className="text-blue-300 text-xs font-medium">
                  {getInitials(post.author)}
                </span>
              </div>
            )}
            <div>
              <div className="text-white font-medium">{getAuthorDisplay(post.author)}</div>
              {post.publishedAt && (
                <div className="text-gray-400 text-xs">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleLike(post.id)}
              className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 text-sm"
            >
              <FaRegThumbsUp /> <span>{post.likeCount}</span>
            </button>
            <button
              onClick={() => handleToggleComments(post.id)}
              className="flex items-center space-x-1 text-gray-400 hover:text-green-400 text-sm"
            >
              <FaRegCommentDots /> <span>{post.commentCount}</span>
            </button>
          </div>
        </div>

        {activeCommentPostId === post.id && (
          <div className="mt-4 border-t border-gray-700 pt-4">
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
              onToggleComments={handleToggleComments}
              onLike={handleLike}
              onDeletePost={handleDeletePost}
              getAuthorDisplay={getAuthorDisplay}
              getAvatarUrl={getAvatarUrl}
              getInitials={getInitials}
            />
          </div>
        )}

        {isAdminOrAuthor && (
          <div className="flex space-x-3 mt-4 border-t border-gray-700 pt-4">
            <Link href={`/posts/edit/${post.id}`}>
              <button className="flex items-center space-x-2 bg-yellow-600 px-3 py-1 rounded-lg hover:bg-yellow-700 text-sm">
                <FaEdit className="w-3 h-3" /> <span>Edit</span>
              </button>
            </Link>
            <button
              onClick={() => handleDeletePost(post.id)}
              className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 text-sm"
            >
              <FaTrash className="w-3 h-3" /> <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
