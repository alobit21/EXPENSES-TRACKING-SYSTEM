import { useEffect } from "react"
import { useRouter } from "next/router"
import RoleGuard from "@/components/dashboard/RoleGuard"
import DashboardLayout from "@/components/dashboard/DashboardLayout"

export default function AdminDashboard() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/author")
  }, [router])
  return (
    <RoleGuard allow={["ADMIN", "AUTHOR"]}>
      <DashboardLayout>
        <div className="py-16 text-center text-muted-foreground">Redirecting to dashboard...</div>
      </DashboardLayout>
    </RoleGuard>
  )
}
