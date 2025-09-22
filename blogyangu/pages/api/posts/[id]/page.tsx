'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BlogPost from '../../../../components/BlogPost'
import { PostWithDetails } from '../../../../types/blog'

export default function PostPage() {
  const params = useParams()
  const id = params?.id
  const [post, setPost] = useState<PostWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!post) return <p>Post not found.</p>

  return <BlogPost post={post} />
}
