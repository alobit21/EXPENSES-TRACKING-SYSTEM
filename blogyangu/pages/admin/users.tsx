import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"
import RoleGuard from "@/components/dashboard/RoleGuard"
import DataTable from "@/components/dashboard/DataTable"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import UserModal from "@/components/admin/UserModal"

interface User {
  id: string
  email: string
  username?: string
  displayName?: string
  role: string
  createdAt: string
  updatedAt: string
  isVerified: boolean
}

interface UserRow {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
  actions?: string
}

export default function AdminUsers() {
  const { data: session } = useSession()
  const role = session?.user?.role as string | undefined
  const isAdmin = role === "ADMIN"
  const [users, setUsers] = useState<User[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/users")
        if (res.ok) {
          const data = await res.json()
          setUsers(data)
        } else {
          setError("Failed to fetch users")
        }
      } catch {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const onCreate = () => { setEditing(null); setOpenModal(true) }
  const onEdit = async (row: UserRow) => { 
    const user = users.find(u => u.id === row.id)
    if (user) setEditing(user); setOpenModal(true) 
  }
  const onDelete = async (row: UserRow) => {
    if (!confirm("Delete this user?")) return
    try {
      const res = await fetch(`/api/users/${row.id}`, { method: "DELETE" })
      if (res.ok) setUsers((arr) => arr.filter((x) => x.id !== row.id))
    } catch {}
  }

  return (
    <RoleGuard allow={["ADMIN", "AUTHOR"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Users</h1>
            {isAdmin && (
              <button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">New User</button>
            )}
          </header>

          {isAdmin && (
            <UserModal
              open={openModal}
              onClose={() => setOpenModal(false)}
              mode={editing ? "edit" : "create"}
              initialUser={editing ? {
                id: editing.id,
                username: editing.username || '',
                email: editing.email,
                displayName: editing.displayName,
                role: editing.role as Role
              } : undefined}
              onSaved={(u) => {
                const newUser: User = {
                  id: u.id || '',
                  email: u.email,
                  username: u.username,
                  displayName: u.displayName,
                  role: u.role.toString(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  isVerified: false
                }
                if (editing) {
                  setUsers((arr) => arr.map((x) => (x.id === u.id ? { ...x, ...newUser } : x)))
                } else {
                  setUsers((arr) => [newUser, ...arr])
                }
                setEditing(null)
                setOpenModal(false)
              }}
            />
          )}

          {loading ? (
            <div className="text-muted-foreground">Loading users...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <DataTable
              columns={[
                { key: "id", header: "ID" },
                { key: "username", header: "Username" },
                { key: "email", header: "Email" },
                { key: "role", header: "Role" },
                { key: "createdAt", header: "Created", render: (r: UserRow) => new Date(r.createdAt).toLocaleString() },
                ...(isAdmin
                  ? ([{ key: "actions", header: "Actions", render: (row: UserRow) => (
                      <div className="flex gap-2">
                        <button className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded" onClick={() => onEdit(row)}>Edit</button>
                        <button className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded" onClick={() => onDelete(row)}>Delete</button>
                      </div>
                    ) }] as const)
                  : ([] as const)),
              ]}
              rows={users.map((u) => ({
                id: u.id,
                username: u.username || u.displayName || "user",
                email: u.email || "",
                role: u.role || "USER",
                createdAt: u.createdAt,
                ...(isAdmin ? { actions: "" } : {}),
              }))}
            />
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
