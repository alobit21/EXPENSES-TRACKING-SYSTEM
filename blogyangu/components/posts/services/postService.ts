import { useRouter } from "next/router"
import { Post, Comment } from "../types"
import { Category as PrismaCategory } from "@prisma/client"
import React from "react"
import { Session } from "next-auth"

export class PostService {
  static async fetchCategories(setCategories: (categories: PrismaCategory[]) => void) {
    try {
      // Use the full URL from the environment or fall back to current origin
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      
      // Log the URL being called for debugging
      const apiUrl = `${basePath}/api/categories`;
      const fullUrl = new URL(apiUrl, baseUrl).toString();
      console.log('Fetching categories from:', fullUrl);
      
      const res = await fetch(fullUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      
      // Log response details for debugging
      console.log('Response status:', res.status, res.statusText);
      
      if (!res.ok) {
        // Try to get the error message from the response
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse the error as JSON, use the status text
          errorMessage = res.statusText || errorMessage;
        }
        throw new Error(`Failed to fetch categories: ${errorMessage}`);
      }
      
      const data = await res.json();
      console.log('Categories data received:', data);
      setCategories(data);
      return data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      console.error("Failed to fetch categories:", {
        error: errorObj,
        message: errorObj.message,
        stack: errorObj.stack,
        timestamp: new Date().toISOString()
      });
      // Re-throw with more context
      const error = new Error(`Failed to load categories: ${errorObj.message}`);
      error.name = 'CategoriesFetchError';
      throw error;
    }
  }

  static async denyComment(
    commentId: number,
    postId: number,
    note: string,
    setCommentsByPost: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
  ) {
    try {
      const res = await fetch(`/api/comments/${commentId}/deny`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e?.error || "Failed to deny comment")
      }
      const data = await res.json() as { id: number; status: string; postId: number; moderationNote?: string }
      setCommentsByPost((prev) => {
        const deepClone = (arr: Comment[]): Comment[] => arr.map((c) => ({ ...c, replies: c.replies ? deepClone(c.replies) : [] }))
        const list = prev[postId] ? deepClone(prev[postId]) : []
        const visit = (items: Comment[]): boolean => {
          for (const it of items) {
            if (it.id === commentId) {
              it.status = data.status as "APPROVED" | "PENDING" | "SPAM" | "REJECTED"
              it.moderationNote = data.moderationNote
              return true
            }
            if (it.replies && visit(it.replies)) return true
          }
          return false
        }
        visit(list)
        return { ...prev, [postId]: list }
      })
    } catch (error) {
      console.error("Deny comment error:", error)
      alert(error instanceof Error ? error.message : "Failed to deny comment")
    }
  }

  static async editComment(
    commentId: number,
    postId: number,
    content: string,
    setCommentsByPost: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
  ) {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e?.error || "Failed to edit comment")
      }
      const data = await res.json() as { id: number; content: string; status: string; postId: number }
      setCommentsByPost((prev) => {
        const deepClone = (arr: Comment[]): Comment[] => arr.map((c) => ({ ...c, replies: c.replies ? deepClone(c.replies) : [] }))
        const list = prev[postId] ? deepClone(prev[postId]) : []
        const visit = (items: Comment[]): boolean => {
          for (const it of items) {
            if (it.id === commentId) {
              it.content = data.content
              it.status = data.status as "APPROVED" | "PENDING" | "SPAM" | "REJECTED"
              return true
            }
            if (it.replies && visit(it.replies)) return true
          }
          return false
        }
        visit(list)
        return { ...prev, [postId]: list }
      })
    } catch (error) {
      console.error("Edit comment error:", error)
      alert(error instanceof Error ? error.message : "Failed to edit comment")
    }
  }

  static async deleteComment(
    commentId: number,
    postId: number,
    setCommentsByPost: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
  ) {
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e?.error || "Failed to delete comment")
      }
      setCommentsByPost((prev) => {
        const removeFrom = (items: Comment[]): Comment[] => {
          return items
            .filter((it) => it.id !== commentId)
            .map((it) => ({ ...it, replies: it.replies ? removeFrom(it.replies) : [] }))
        }
        const next = { ...prev }
        next[postId] = removeFrom(prev[postId] || [])
        return next
      })
    } catch (error) {
      console.error("Delete comment error:", error)
      alert(error instanceof Error ? error.message : "Failed to delete comment")
    }
  }

  static async likeComment(
    commentId: number,
    postId: number,
    session: Session | null,
    setCommentsByPost: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
  ) {
    if (!session?.user?.id) {
      alert("Please login to like comments")
      return
    }

    try {
      const res = await fetch(`/api/comments/${commentId}/like`, { method: "POST" })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e?.error || "Failed to like comment")
      }
      const data = await res.json() as { liked: boolean; likeCount: number }

      // update tree likeCount
      setCommentsByPost((prev) => {
        const deepClone = (arr: Comment[]): Comment[] => arr.map((c) => ({ ...c, replies: c.replies ? deepClone(c.replies) : [] }))
        const list = prev[postId] ? deepClone(prev[postId]) : []
        const visit = (items: Comment[]): boolean => {
          for (const it of items) {
            if (it.id === commentId) {
              it.likeCount = data.likeCount
              return true
            }
            if (it.replies && visit(it.replies)) return true
          }
          return false
        }
        visit(list)
        return { ...prev, [postId]: list }
      })
    } catch (error) {
      console.error("Comment like error:", error)
      alert(error instanceof Error ? error.message : "Failed to like comment")
    }
  }

  static async approveComment(
    commentId: number,
    postId: number,
    setCommentsByPost: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>,
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  ) {
    try {
      const res = await fetch(`/api/comments/${commentId}/approve`, {
        method: "PATCH",
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e?.error || "Failed to approve comment")
      }

      // Update comment status in local state
      setCommentsByPost((prev) => {
        const deepClone = (arr: Comment[]): Comment[] => arr.map((c) => ({ ...c, replies: c.replies ? deepClone(c.replies) : [] }))
        const list = prev[postId] ? deepClone(prev[postId]) : []
        const visit = (items: Comment[]): boolean => {
          for (const it of items) {
            if (it.id === commentId) {
              it.status = "APPROVED"
              return true
            }
            if (it.replies && visit(it.replies)) return true
          }
          return false
        }
        visit(list)
        return { ...prev, [postId]: list }
      })

      // Increment approved comment count for the post
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p)))
    } catch (error) {
      console.error("Approve comment error:", error)
      alert(error instanceof Error ? error.message : "Failed to approve comment")
    }
  }

  private static showLoginAlert(router: ReturnType<typeof useRouter>) {
    const shouldLogin = confirm("Please login to like posts. Click OK to login.")
    if (shouldLogin) {
      router.push('/auth/signin')
    }
  }

  static async fetchPostsAndComments(
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>, 
    setCommentsByPost: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>, 
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
        setPosts((prev) =>
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
    setActiveCommentPostId: React.Dispatch<React.SetStateAction<number | null>>,
    setLoadingComments: (loading: boolean) => void,
    setCommentsByPost: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>,
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>
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
        setPosts((prev) =>
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
  content: string,
  session: Session | null,
  setCommentsByPost: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>,
  setCommentText?: React.Dispatch<React.SetStateAction<string>>,
  setActiveCommentPostId?: React.Dispatch<React.SetStateAction<number | null>>,
  setPosts?: React.Dispatch<React.SetStateAction<Post[]>>,
  parentId?: number
) {
  if (!content || !content.trim()) return

  // Add proper session validation
  if (!session?.user?.id) {
    alert("Please login to comment")
    return
  }

  try {
    const userId = parseInt(session.user.id)
    if (isNaN(userId)) {
      throw new Error("Invalid user ID")
    }

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`,
      },
      body: JSON.stringify({ content, parentId }),
    })

    if (res.ok) {
      const newComment = await res.json()
      alert("Thank you for your comment. Your contribution will be public after admin approval.")
      setCommentsByPost((prev) => {
        const deepClone = (arr: Comment[]): Comment[] => arr.map((c) => ({ ...c, replies: c.replies ? deepClone(c.replies) : [] }))
        const list = prev[postId] ? deepClone(prev[postId]) : []
        if (parentId) {
          const attach = (items: Comment[]): boolean => {
            for (const it of items) {
              if (it.id === parentId) {
                it.replies = it.replies || []
                it.replies.unshift(newComment)
                return true
              }
              if (it.replies && attach(it.replies)) return true
            }
            return false
          }
          if (!attach(list)) {
            // parent not found; fallback to root prepend
            list.unshift(newComment)
          }
        } else {
          // root level comment
          list.unshift(newComment)
        }
        return { ...prev, [postId]: list }
      })
      if (setCommentText) setCommentText("")
      if (setActiveCommentPostId) setActiveCommentPostId(null)
      // Do NOT increment post.commentCount here because it should count only APPROVED comments.
    } else {
      const error = await res.json()
      // Handle 401 Unauthorized specifically
      if (res.status === 401) {
        throw new Error("Please login to comment")
      } else {
        throw new Error(error?.error || "Failed to post comment")
      }
    }
  } catch (err) {
    console.error("Comment error:", err)
    alert(err instanceof Error ? err.message : "Something went wrong while posting your comment.")
  }
}

 static async likePost(postId: number, session: Session | null, setPosts: React.Dispatch<React.SetStateAction<Post[]>>, router?: ReturnType<typeof useRouter>) {
  if (!session?.user?.id) {
    if (router) {
      this.showLoginAlert(router)
    } else {
      alert("Please login to like posts")
    }
    return
  }

  try {
    const userId = parseInt(session.user.id)
    if (isNaN(userId)) {
      throw new Error("Invalid user ID")
    }

    const res = await fetch("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`, // Use parsed userId
      },
      body: JSON.stringify({ postId }),
    })

    if (res.ok) {
      const data = await res.json()
      setPosts((prev) =>
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
    } else if (res.status === 401) {
      alert("Please login to like posts")
    }
  } catch (error) {
    console.error("Like error:", error)
  }
}

  static async deletePost(
    postId: number, 
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>, 
    setCommentsByPost: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
  ) {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" })
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId))
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