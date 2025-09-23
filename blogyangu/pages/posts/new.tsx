"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import PostForm from "@/components/PostForm"

interface Category {
  id: number
  name: string
}
 

type Author = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string | null;
  displayName: string;
  username: string;
  avatarUrl?: string | null; // ✅ Add this line
};

function isAuthor(user: any): user is Author {
  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.displayName === 'string' &&
    typeof user.username === 'string'
  );
}


export default function NewPostPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const res = await fetch("/api/categories")
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        } else {
          setError("Failed to fetch categories")
          console.error("Failed to fetch categories")
        }
      } catch (err) {
        setError("An error occurred while fetching categories")
        console.error("Error fetching categories:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleCreate = async (formData: FormData) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      })
      if (res.ok) {
        const post = await res.json()
        alert(`Post created: ${post.title}`)
        window.location.href = `/posts/${post.id}`
      } else {
        const err = await res.json()
        alert(err.message || "Failed to create post")
      }
    } catch (err) {
      console.error("Error creating post:", err)
      alert("An error occurred while creating the post")
    }
  }

  const getAuthorDisplay = (author: Author) => {
    return author?.displayName || author?.username || "Unknown Author"
  }

  const getAvatarUrl = (author: Author) => {
    return author?.avatarUrl || null
  }

  const getInitials = (author: Author) => {
    const name = getAuthorDisplay(author)
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
          <p className="text-gray-400">Share your thoughts with the community</p>
        </header>

        <div className="flex items-center gap-4 mb-6">
          {session?.user ? (
            <>
              {getAvatarUrl(session.user as Author) && !imageError ? (
                <img
                  src={getAvatarUrl(session.user as Author)!}
                  alt={getAuthorDisplay(session.user as Author)}
                  className="w-10 h-10 rounded-full border border-gray-600"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center border border-gray-600">
                  <span className="text-blue-300 text-sm font-medium">
                    {getInitials(session.user as Author)}
                  </span>
                </div>
              )}
              <span className="text-gray-200 font-medium">
                {getAuthorDisplay(session.user as Author)}
              </span>
            </>
          ) : (
            <p className="text-gray-400">Please log in to create a post</p>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <PostForm categories={categories} onSubmit={handleCreate} />
        </div>
      </div>
    </div>
  )
}