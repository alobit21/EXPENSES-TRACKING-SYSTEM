'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Post {
  id: number
  title: string
  content: string
  coverImage?: string
}

export default function AdminPosts() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetch('/api/admin/posts')
        .then(res => res.json())
        .then(setPosts)
    }
  }, [session])

  const handleCreate = async () => {
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, coverImage })
    })
    const newPost = await res.json()
    setPosts([newPost, ...posts])
    setTitle('')
    setContent('')
    setCoverImage('')
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    setPosts(posts.filter(post => post.id !== id))
  }

  if (!session || session.user.role !== 'admin') {
    return <p>Access denied</p>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Manage Posts</h1>

      <div className="mb-8">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          placeholder="Cover Image URL"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create Post</button>
      </div>

      <div>
        {posts.map(post => (
          <div key={post.id} className="border p-4 mb-2 rounded flex justify-between items-center">
            <div>
              <h2 className="font-bold">{post.title}</h2>
              <p>{post.content.substring(0, 100)}...</p>
            </div>
            <button onClick={() => handleDelete(post.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
