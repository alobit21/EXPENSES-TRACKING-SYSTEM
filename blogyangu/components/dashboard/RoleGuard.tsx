"use client"

import React from "react"
import { useSession } from "next-auth/react"

export default function RoleGuard({ allow, children }: { allow: ("ADMIN" | "AUTHOR")[]; children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="min-h-[30vh] flex items-center justify-center text-muted-foreground">Checking access...</div>
  }
  const role = (session?.user as any)?.role as string | undefined
  const ok = role && allow.includes(role as any)
  if (!ok) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center text-muted-foreground">
        Access denied. Required role: {allow.join(" or ")}
      </div>
    )
  }
  return <>{children}</>
}
