import PostForm from "@/components/PostForm"
import { Category } from "@prisma/client"
import { Post } from "./types"
import { Dispatch, SetStateAction } from "react"
import { Session } from "next-auth"

interface CreatePostModalProps {
  showModal: boolean
  setShowModal: (show: boolean) => void
  categories: Category[]
  session: Session | null
  setPosts: Dispatch<SetStateAction<Post[]>>
}

export default function CreatePostModal({ 
  showModal, 
  setShowModal, 
  categories, 
  session, 
  setPosts 
}: CreatePostModalProps) {
  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-white text-gray-900 dark:bg-gray-900 dark:text-white flex items-center justify-center z-50 p-4">
      <div className=" bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-lg shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">Create New Post</h2>
        <PostForm
          categories={categories}
          initialData={undefined}
          onSubmit={async (formData) => {
            try {
              const res = await fetch("/api/posts", {
                method: "POST",
                body: formData,
                headers: {
                  Authorization: `Bearer ${session?.user?.id}`,
                },
              })

              if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || "Failed to create post")
              }

              const responseData = await res.json()
              const post: Post = {
                id: responseData.id,
                title: responseData.title,
                excerpt: responseData.excerpt,
                slug: responseData.slug,
                coverImage: responseData.coverImage,
                author: responseData.author,
                publishedAt: responseData.publishedAt,
                likeCount: responseData.likeCount || 0,
                commentCount: responseData.commentCount || 0,
                category: responseData.category
              }
              alert(`Post created: ${post.title}`)
              setPosts((prev: Post[]) => [post, ...prev])
              setShowModal(false)
            } catch (err) {
              console.error("Error creating post:", err)
              alert(err instanceof Error ? err.message : "Something went wrong")
            }
          }}
        />
      </div>
    </div>
  )
}