import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import RoleGuard from "@/components/dashboard/RoleGuard"
import DataTable from "@/components/dashboard/DataTable"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import UserModal from "@/components/admin/UserModal"

export default function AdminUsers() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role as string | undefined
  const isAdmin = role === "ADMIN"
  const [users, setUsers] = useState<any[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
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
      } catch (e) {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const onCreate = () => { setEditing(null); setOpenModal(true) }
  const onEdit = async (u: any) => { setEditing(u); setOpenModal(true) }
  const onDelete = async (u: any) => {
    if (!confirm("Delete this user?")) return
    try {
      const res = await fetch(`/api/users/${u.id}`, { method: "DELETE" })
      if (res.ok) setUsers((arr) => arr.filter((x) => x.id !== u.id))
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
              initialUser={editing || undefined}
              onSaved={(u) => {
                if (editing) {
                  setUsers((arr) => arr.map((x) => (x.id === u.id ? { ...x, ...u } : x)))
                } else {
                  setUsers((arr) => [u, ...arr])
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
                { key: "createdAt", header: "Created", render: (r: any) => new Date(r.createdAt).toLocaleString() },
                ...(isAdmin
                  ? ([{ key: "actions", header: "Actions", render: (row: any) => (
                      <div className="flex gap-2">
                        <button className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded" onClick={() => onEdit(row)}>Edit</button>
                        <button className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded" onClick={() => onDelete(row)}>Delete</button>
                      </div>
                    ) }] as any)
                  : ([] as any)),
              ]}
              rows={users.map((u) => ({
                id: u.id,
                username: u.username || u.name || "user",
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
