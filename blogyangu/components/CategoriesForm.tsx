// components/CategoryForm.tsx
import { useState } from "react"

interface CategoryFormProps {
  initialData?: { name: string; slug?: string; description?: string }
  onSubmit: (data: any) => Promise<void>
}

export default function CategoryForm({ initialData, onSubmit }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [description, setDescription] = useState(initialData?.description || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ name, slug, description })
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <div>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label>Slug</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>

      <div>
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <button type="submit" style={{ marginTop: "1rem" }}>Save</button>
    </form>
  )
}
