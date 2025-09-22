import { useState, useEffect, ChangeEvent } from "react"

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
  categories?: { id: number; name: string }[]
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0])
      setCoverImagePreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("excerpt", excerpt)
    formData.append("metaDescription", metaDescription)
    formData.append("status", status)
    formData.append("allowComments", allowComments ? "true" : "false")
    if (categoryId) formData.append("categoryId", categoryId.toString())
    if (coverImageFile) formData.append("coverImage", coverImageFile)

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div>
        <label>Title</label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
      </div>

      <div>
        <label>Excerpt</label>
        <textarea
          name="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
      </div>

      <div>
        <label>Meta Description</label>
        <textarea
          name="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={2}
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
      </div>

      <div>
        <label>Content</label>
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
      </div>

      <div>
        <label>Category</label>
        <select value={categoryId ?? ""} onChange={(e) => setCategoryId(Number(e.target.value) || undefined)}>
          <option value="">-- None --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Cover Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {coverImagePreview && (
          <div style={{ marginTop: "0.5rem" }}>
            <img src={coverImagePreview} alt="Cover Preview" style={{ maxWidth: "100%", height: "auto" }} />
          </div>
        )}
      </div>

      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={allowComments}
            onChange={(e) => setAllowComments(e.target.checked)}
          /> Allow Comments
        </label>
      </div>

      <button type="submit" style={{ marginTop: "1rem" }}>Save</button>
    </form>
  )
}
