import RoleGuard from "@/components/dashboard/RoleGuard"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import PostsPage from "@/components/posts/PostsPage"

export default function AuthorPosts() {
  return (
    <RoleGuard allow={["AUTHOR", "ADMIN"]}>
      <DashboardLayout>
        <PostsPage />
      </DashboardLayout>
    </RoleGuard>
  )
}
