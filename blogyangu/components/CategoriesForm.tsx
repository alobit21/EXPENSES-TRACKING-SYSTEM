import { useState, useEffect } from "react"
import Link from "next/link"

interface CategoryFormProps {
  initialData?: { name: string; slug?: string; description?: string }
  onSubmit: (data: { name: string; slug: string; description: string }) => Promise<void>
}

export default function CategoryForm({ initialData, onSubmit }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [errors, setErrors] = useState<{ name?: string; slug?: string; description?: string }>({})

  // Auto-generate slug from name if not manually edited
  useEffect(() => {
    if (!initialData?.slug && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 50)
      setSlug(generatedSlug)
    }
  }, [name, initialData?.slug])

  const validateForm = () => {
    const newErrors: { name?: string; slug?: string; description?: string } = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (name.length > 100) newErrors.name = "Name must be 100 characters or less"
    if (slug && !/^[a-z0-9-]+$/.test(slug)) newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens"
    if (slug && slug.length > 50) newErrors.slug = "Slug must be 50 characters or less"
    if (description && description.length > 500) newErrors.description = "Description must be 500 characters or less"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    await onSubmit({
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: description.trim(),
    })
  }

  const handleCancel = () => {
    setName(initialData?.name || "")
    setSlug(initialData?.slug || "")
    setDescription(initialData?.description || "")
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setErrors((prev) => ({ ...prev, name: undefined }))
          }}
          className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border ${
            errors.name ? "border-red-400" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          placeholder="Enter category name"
          required
          maxLength={100}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {errors.name ? (
            <span className="text-red-400">{errors.name}</span>
          ) : (
            <span>{name.length}/100 characters</span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-200 mb-1">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setErrors((prev) => ({ ...prev, slug: undefined }))
          }}
          className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border ${
            errors.slug ? "border-red-400" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          placeholder="Auto-generated from name"
          maxLength={50}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {errors.slug ? (
            <span className="text-red-400">{errors.slug}</span>
          ) : (
            <span>{slug.length}/50 characters</span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            setErrors((prev) => ({ ...prev, description: undefined }))
          }}
          rows={4}
          className={`w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border ${
            errors.description ? "border-red-400" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors`}
          placeholder="Describe the category"
          maxLength={500}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {errors.description ? (
            <span className="text-red-400">{errors.description}</span>
          ) : (
            <span>{description.length}/500 characters</span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/categories">
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
          disabled={!name.trim()}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {initialData ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  )
}