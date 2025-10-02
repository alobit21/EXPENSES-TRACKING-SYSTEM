"use client"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { useSession } from "next-auth/react"
import { FaEdit, FaTrash } from "react-icons/fa"
import CategoryForm from "@/components/CategoriesForm"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogMessage, setDialogMessage] = useState("")

  async function fetchCategories() {
    try {
      setLoading(true)
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      } else {
        setError("Failed to fetch categories")
        console.error("Failed to fetch categories")
      }
    } catch (err) {
      setError("An error occurred while fetching categories")
      console.error("Error fetching categories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async (data: { name: string; slug: string; description: string }) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const newCategory = await res.json()
        setCategories([...categories, newCategory])
        setShowForm(false)
        setEditingCategory(null)
        setDialogTitle("Category created")
        setDialogMessage(`${newCategory.name}`)
        setDialogOpen(true)
      } else {
        const err = await res.json()
        setDialogTitle("Create failed")
        setDialogMessage(err.message || "Failed to create category")
        setDialogOpen(true)
      }
    } catch (err) {
      console.error("Error creating category:", err)
      setDialogTitle("Create error")
      setDialogMessage("An error occurred while creating the category")
      setDialogOpen(true)
    }
  }

  const handleEdit = async (category: Category, data: { name: string; slug: string; description: string }) => {
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const updatedCategory = await res.json()
        setCategories(categories.map((cat) => (cat.id === category.id ? updatedCategory : cat)))
        setShowForm(false)
        setEditingCategory(null)
        setDialogTitle("Category updated")
        setDialogMessage(`${updatedCategory.name}`)
        setDialogOpen(true)
      } else {
        const err = await res.json()
        setDialogTitle("Update failed")
        setDialogMessage(err.message || "Failed to update category")
        setDialogOpen(true)
      }
    } catch (err) {
      console.error("Error updating category:", err)
      setDialogTitle("Update error")
      setDialogMessage("An error occurred while updating the category")
      setDialogOpen(true)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      })
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id))
        setDialogTitle("Deleted")
        setDialogMessage("Category deleted successfully")
        setDialogOpen(true)
      } else {
        const err = await res.json()
        setDialogTitle("Delete failed")
        setDialogMessage(err.message || "Failed to delete category")
        setDialogOpen(true)
      }
    } catch (err) {
      console.error("Error deleting category:", err)
      setDialogTitle("Delete error")
      setDialogMessage("An error occurred while deleting the category")
      setDialogOpen(true)
    }
  }

  const isAdminOrAuthor = session?.user?.role && ["ADMIN", "AUTHOR"].includes(session.user.role)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-300 text-lg">Loading categories...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center max-w-md mx-auto py-16">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null)
              window.location.reload()
            }}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <header className="mb-2">
          <h1 className="text-3xl font-bold text-foreground">Manage Categories</h1>
          <p className="text-muted-foreground">Create, edit, or delete categories for your posts</p>
        </header>

        {isAdminOrAuthor ? (
          <>
            {!showForm && (
              <button
                onClick={() => {
                  setShowForm(true)
                  setEditingCategory(null)
                }}
                className="mb-8 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Category
              </button>
            )}

            {showForm && (
              <div className="bg-card dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8 border border-border dark:border-gray-700">
                <h2 className="text-xl font-semibold text-foreground dark:text-gray-200 mb-4">
                  {editingCategory ? "Edit Category" : "Create New Category"}
                </h2>
                <CategoryForm
                  initialData={editingCategory ?? undefined}
                  onSubmit={editingCategory ? (data) => handleEdit(editingCategory, data) : handleCreate}
                />

              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground mb-8">You need to be an admin or author to manage categories.</p>
        )}

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-xl">No categories available yet</div>
            <p className="text-muted-foreground mt-2">Create a new category to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-card dark:bg-gray-900 rounded-xl shadow-lg p-6 flex justify-between items-start border border-border dark:border-gray-700"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-gray-200">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Slug: {cat.slug}</p>
                  {cat.description && (
                    <p className="text-sm text-muted-foreground dark:text-gray-300 mt-2 line-clamp-3">{cat.description}</p>
                  )}
                </div>
                {isAdminOrAuthor && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingCategory(cat)
                        setShowForm(true)
                      }}
                      className="p-2 text-yellow-500 hover:text-yellow-400 transition-colors"
                      title="Edit category"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-red-500 hover:text-red-400 transition-colors"
                      title="Delete category"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle || "Notice"}</DialogTitle>
              {dialogMessage ? (
                <DialogDescription>{dialogMessage}</DialogDescription>
              ) : null}
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}