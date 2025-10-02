// components/BlogPost.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import CommentThread from './CommentThread'
import { PostWithDetails, CommentWithAuthor } from '../types/blog'

interface BlogPostProps {
  post: PostWithDetails
}



// Helper function to calculate read time
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export default function BlogPost({ post }: BlogPostProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>(post.comments || [])
  const [newComment, setNewComment] = useState('')
  const { data: session } = useSession()

  const readTime = post.readTime || calculateReadTime(post.content)

  const handleAddComment = async () => {
    if (newComment.trim() && session?.user?.id) {
      try {
        const response = await fetch(`/api/posts/${post.id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newComment,
          }),
        })

        if (response.ok) {
          const comment = await response.json()
          setComments([comment, ...comments])
          setNewComment('')
        }
      } catch (error) {
        console.error('Error adding comment:', error)
      }
    }
  }

  const handleReply = async (parentId: number, content: string) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          parentId,
        }),
      })

      if (response.ok) {
        const reply = await response.json()
        
        // Update the comments state to include the new reply
        const updateCommentsWithReply = (comments: CommentWithAuthor[]): CommentWithAuthor[] => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), reply]
              }
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentsWithReply(comment.replies)
              }
            }
            return comment
          })
        }
        
        setComments(updateCommentsWithReply(comments))
      }
    } catch (error) {
      console.error('Error adding reply:', error)
    }
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <Image
            src={post.author.avatarUrl || '/default-avatar.png'}
            alt={post.author.displayName || post.author.username}
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">
              {post.author.displayName || post.author.username}
            </p>
            <p className="text-sm">
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'} · {readTime} min read
            </p>
          </div>
        </div>
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            width={800}
            height={256}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
      </header>

      <div className="prose max-w-none mb-8">
        {post.content}
      </div>

      <div className="border-t pt-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">Comments ({post._count?.comments || 0})</h2>
        
        {/* New Comment Form */}
        {session?.user && (
          <div className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </div>
          </div>
        )}

        {/* Comments Thread */}
        <div>
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                postId={post.id}
                onReply={handleReply}
              />
            ))
          )}
        </div>
      </div>
    </article>
  )
}