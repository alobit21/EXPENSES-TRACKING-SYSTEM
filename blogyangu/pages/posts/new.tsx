"use client"
import { useEffect, useState } from "react"
import PostForm from "@/components/PostForm"

interface Category {
  id: number
  name: string
}

export default function NewPostPage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      } else {
        console.error("Failed to fetch categories")
      }
    }
    fetchCategories()
  }, [])

  const handleCreate = async (formData: FormData) => {
    const res = await fetch("/api/posts", { method: "POST", body: formData })
    if (res.ok) {
      const post = await res.json()
      alert(`Post created: ${post.title}`)
      // Optionally redirect or clear form
    } else {
      const err = await res.json()
      alert(err.message || "Failed to create post")
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create New Post</h1>
      <PostForm categories={categories} onSubmit={handleCreate} />
    </div>
  )
}
