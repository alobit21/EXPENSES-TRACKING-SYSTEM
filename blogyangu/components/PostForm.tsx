import { useState, useEffect, ChangeEvent } from "react"
import Link from "next/link"

interface Category {
  id: number
  name: string
}

interface PostFormProps {
  initialData?: {
    id?: number
    title: string
    content: string
    excerpt?: string
    metaDescription?: string
    coverImage?: string
    categoryId?: number
    status?: string
    allowComments?: boolean
  }
  categories?: Category[]
  onSubmit: (formData: FormData) => Promise<void>
}

export default function PostForm({ initialData, categories = [], onSubmit }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "")
  const [status, setStatus] = useState(initialData?.status || "DRAFT")
  const [allowComments, setAllowComments] = useState(initialData?.allowComments ?? true)
  const [categoryId, setCategoryId] = useState<number | undefined>(initialData?.categoryId)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState(initialData?.coverImage || "")
  const [imageError, setImageError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{
    title?: string
    content?: string
    excerpt?: string
    metaDescription?: string
  }>({})

  // Clean up image preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (coverImagePreview && coverImageFile) {
        URL.revokeObjectURL(coverImagePreview)
      }
    }
  }, [coverImagePreview, coverImageFile])

  const validateForm = () => {
    const newErrors: { title?: string; content?: string; excerpt?: string; metaDescription?: string } = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (title.length > 200) newErrors.title = "Title must be 200 characters or less"
    if (!content.trim()) newErrors.content = "Content is required"
    if (excerpt && excerpt.length > 300) newErrors.excerpt = "Excerpt must be 300 characters or less"
    if (metaDescription && metaDescription.length > 160) {
      newErrors.metaDescription = "Meta description must be 160 characters or less"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (!validTypes.includes(file.type)) {
        setImageError("Only JPEG, PNG, or GIF images are allowed")
        setCoverImageFile(null)
        setCoverImagePreview("")
        return
      }
      if (file.size > maxSize) {
        setImageError("Image size must be less than 5MB")
        setCoverImageFile(null)
        setCoverImagePreview("")
        return
      }
      if (coverImagePreview && coverImageFile) {
        URL.revokeObjectURL(coverImagePreview)
      }
      setCoverImageFile(file)
      setImageError(null)
      setCoverImagePreview(URL.createObjectURL(file))
    } else {
      setCoverImageFile(null)
      setCoverImagePreview(initialData?.coverImage || "")
      setImageError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("excerpt", excerpt)
    formData.append("metaDescription", metaDescription)
    formData.append("status", status)
    formData.append("allowComments", allowComments ? "true" : "false")
    if (categoryId) formData.append("categoryId", categoryId.toString())
    if (coverImageFile) formData.append("coverImage", coverImageFile)
    if (initialData?.id) formData.append("id", initialData.id.toString())

    await onSubmit(formData)
  }

  const handleCancel = () => {
    setTitle(initialData?.title || "")
    setContent(initialData?.content || "")
    setExcerpt(initialData?.excerpt || "")
    setMetaDescription(initialData?.metaDescription || "")
    setStatus(initialData?.status || "DRAFT")
    setAllowComments(initialData?.allowComments ?? true)
    setCategoryId(initialData?.categoryId)
    setCoverImageFile(null)
    setCoverImagePreview(initialData?.coverImage || "")
    setImageError(null)
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setErrors((prev) => ({ ...prev, title: undefined }))
          }}
          className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border ${
            errors.title ? "border-red-400" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          placeholder="Enter post title"
          required
          maxLength={200}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {errors.title ? (
            <span className="text-red-400">{errors.title}</span>
          ) : (
            <span>{title.length}/200 characters</span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-200 mb-1">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={excerpt}
          onChange={(e) => {
            setExcerpt(e.target.value)
            setErrors((prev) => ({ ...prev, excerpt: undefined }))
          }}
          rows={3}
          className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border ${
            errors.excerpt ? "border-red-400" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors`}
          placeholder="Write a brief summary of your post"
          maxLength={300}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {errors.excerpt ? (
            <span className="text-red-400">{errors.excerpt}</span>
          ) : (
            <span>{excerpt.length}/300 characters</span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-200 mb-1">
          Meta Description
        </label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          value={metaDescription}
          onChange={(e) => {
            setMetaDescription(e.target.value)
            setErrors((prev) => ({ ...prev, metaDescription: undefined }))
          }}
          rows={3}
          className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border ${
            errors.metaDescription ? "border-red-400" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors`}
          placeholder="Enter a meta description for SEO"
          maxLength={160}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {errors.metaDescription ? (
            <span className="text-red-400">{errors.metaDescription}</span>
          ) : (
            <span>{metaDescription.length}/160 characters</span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-1">
          Content <span className="text-red-400">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setErrors((prev) => ({ ...prev, content: undefined }))
          }}
          rows={10}
          className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border ${
            errors.content ? "border-red-400" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors`}
          placeholder="Write your post content here..."
          required
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-400">{errors.content}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value) || undefined)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-200 mb-1">
          Cover Image
        </label>
        <div className="relative">
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700 transition-colors"
          />
        </div>
        {imageError && (
          <p className="mt-1 text-xs text-red-400">{imageError}</p>
        )}
        {coverImagePreview && !imageError && (
          <div className="mt-4 rounded-lg overflow-hidden shadow-lg">
            <img
              src={coverImagePreview}
              alt="Cover image preview"
              className="w-full h-64 object-cover"
              onError={() => {
                setImageError("Failed to load image preview")
                setCoverImagePreview(initialData?.coverImage || "")
              }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-200 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="flex items-center text-sm font-medium text-gray-200">
            <input
              type="checkbox"
              checked={allowComments}
              onChange={(e) => setAllowComments(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
            />
            Allow Comments
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/posts">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-700 text-gray-200 font-medium rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </Link>
        <button
          type="submit"
          disabled={!title.trim() || !content.trim()}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {initialData?.id ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  )
}