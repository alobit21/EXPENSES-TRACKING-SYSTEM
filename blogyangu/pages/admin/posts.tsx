'use client'

import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import RoleGuard from '@/components/dashboard/RoleGuard'
import PostsPage from '@/components/posts/PostsPage'

export default function AdminPosts() {
  const { data: session } = useSession()

  return (
    <RoleGuard allow={["ADMIN"]}>
      <DashboardLayout>
        <PostsPage />
      </DashboardLayout>
    </RoleGuard>
  )
}
