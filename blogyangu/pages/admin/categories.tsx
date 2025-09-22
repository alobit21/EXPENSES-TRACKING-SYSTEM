import CategoryForm from "@/components/CategoriesForm"
import { useEffect, useState } from "react"

interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function fetchCategories() {
    const res = await fetch("/api/categories")
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSaved = () => {
    setEditingCategory(null)
    setShowForm(false)
    fetchCategories()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
    if (res.ok) setCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Categories</h1>
      <button onClick={() => { setShowForm(true); setEditingCategory(null) }}>Add New Category</button>

      {showForm && (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
          <CategoryForm category={editingCategory ?? undefined} onSaved={handleSaved} />
          <button onClick={() => setShowForm(false)} style={{ marginTop: "0.5rem" }}>Cancel</button>
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0, marginTop: "2rem" }}>
        {categories.map((cat) => (
          <li key={cat.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem" }}>
            <strong>{cat.name}</strong> <em>({cat.slug})</em>
            <p>{cat.description || "No description"}</p>
            <button onClick={() => { setEditingCategory(cat); setShowForm(true) }}>Edit</button>
            <button onClick={() => handleDelete(cat.id)} style={{ marginLeft: "0.5rem", color: "red" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
