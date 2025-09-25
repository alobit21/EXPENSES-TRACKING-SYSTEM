import { Post } from "@prisma/client"

export class PostService {
  static async fetchCategories(setCategories: (categories: any[]) => void) {
    try {
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err)
    }
  }

  static async fetchPostsAndComments(
    setPosts: (posts: Post[]) => void, 
    setCommentsByPost: (comments: Record<number, Comment[]>) => void, 
    setLoading: (loading: boolean) => void
  ) {
    try {
      setLoading(true)
      const res = await fetch("/api/posts")
      if (res.ok) {
        const data = await res.json()
        const postsWithCounts = data.map((post: Post) => ({
          ...post,
          likeCount: post.likeCount || 0,
          commentCount: post.commentCount || 0,
        }))
        setPosts(postsWithCounts)

        const commentPromises = postsWithCounts.map(async (post: Post) => {
          try {
            const commentRes = await fetch(`/api/posts/${post.id}/comments`)
            if (commentRes.ok) {
              const comments = await commentRes.json()
              setCommentsByPost((prev) => ({ ...prev, [post.id]: comments }))
              return { id: post.id, commentCount: comments.length }
            }
            return { id: post.id, commentCount: 0 }
          } catch (error) {
            console.error(`Failed to fetch comments for post ${post.id}:`, error)
            return { id: post.id, commentCount: 0 }
          }
        })

        const commentCounts = await Promise.all(commentPromises)
        setPosts((prev: Post[]) =>
          prev.map((p) => {
            const countData = commentCounts.find((c) => c.id === p.id)
            return { ...p, commentCount: countData?.commentCount || p.commentCount }
          })
        )
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  static async toggleComments(
    postId: number,
    activeCommentPostId: number | null,
    setActiveCommentPostId: (id: number | null) => void,
    setLoadingComments: (loading: boolean) => void,
    setCommentsByPost: (comments: Record<number, Comment[]>) => void,
    setPosts: (posts: Post[]) => void
  ) {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null)
      return
    }

    setActiveCommentPostId(postId)
    setLoadingComments(true)

    try {
      const res = await fetch(`/api/posts/${postId}/comments`)
      if (res.ok) {
        const data = await res.json()
        setCommentsByPost((prev) => ({ ...prev, [postId]: data }))
        setPosts((prev: Post[]) =>
          prev.map((p) =>
            p.id === postId ? { ...p, commentCount: data.length } : p
          )
        )
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setLoadingComments(false)
    }
  }

  static async submitComment(
    postId: number,
    commentText: string,
    session: any,
    setCommentsByPost: (comments: Record<number, Comment[]>) => void,
    setCommentText: (text: string) => void,
    setActiveCommentPostId: (id: number | null) => void,
    setPosts: (posts: Post[]) => void
  ) {
    if (!commentText.trim()) return

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({ content: commentText }),
      })

      if (res.ok) {
        const newComment = await res.json()
        setCommentsByPost((prev) => ({
          ...prev,
          [postId]: [newComment, ...(prev[postId] || [])],
        }))
        setCommentText("")
        setActiveCommentPostId(null)
        setPosts((prev: Post[]) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, commentCount: (p.commentCount || 0) + 1 }
              : p
          )
        )
      } else {
        const error = await res.json()
        throw new Error(error?.error || "Failed to post comment")
      }
    } catch (err) {
      console.error("Comment error:", err)
      alert(err instanceof Error ? err.message : "Something went wrong while posting your comment.")
    }
  }

  static async likePost(postId: number, session: any, setPosts: (posts: Post[]) => void) {
    if (!session) {
      alert("Please login to like posts")
      return
    }

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({ postId }),
      })

      if (res.ok) {
        const data = await res.json()
        setPosts((prev: Post[]) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likeCount: data.liked
                    ? (p.likeCount || 0) + 1
                    : Math.max((p.likeCount || 0) - 1, 0),
                }
              : p
          )
        )
      }
    } catch (error) {
      console.error("Like error:", error)
    }
  }

  static async deletePost(
    postId: number, 
    setPosts: (posts: Post[]) => void, 
    setCommentsByPost: (comments: Record<number, Comment[]>) => void
  ) {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" })
      if (res.ok) {
        setPosts((prev: Post[]) => prev.filter((p) => p.id !== postId))
        setCommentsByPost((prev) => {
          const updated = { ...prev }
          delete updated[postId]
          return updated
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete post")
    }
  }
}