import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import PostForm from "../../../components/PostForm"

export default function EditPostPage() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    async function fetchPost() {
      const res = await fetch(`/api/posts/${id}`)
      if (res.ok) setPost(await res.json())
    }
    fetchPost()
  }, [id])

  async function handleUpdate(data: any) {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const updated = await res.json()
      router.push(`/posts/${updated.id}`)
    } else {
      alert("Error updating post")
    }
  }

  if (!post) return <p>Loading...</p>

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit Post</h1>
      <PostForm initialData={post} onSubmit={handleUpdate} />
    </div>
  )
}
