// pages/categories/index.tsx
import CategoryForm from "@/components/CategoriesForm"
import { useEffect, useState } from "react"

interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    }
    fetchCategories()
  }, [])

  const handleCreate = async (data: any) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const newCategory = await res.json()
      setCategories([...categories, newCategory])
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Categories</h1>
      <CategoryForm onSubmit={handleCreate} />
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            {cat.name} ({cat.slug})
            <p>{cat.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
