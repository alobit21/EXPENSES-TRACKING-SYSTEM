"use client"

import React from "react"
import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"

interface RoleGuardProps {
  allow: Role[]
  children: React.ReactNode
}

export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="min-h-[30vh] flex items-center justify-center text-muted-foreground">Checking access...</div>
  }
  const role = session?.user?.role as Role | undefined
  const ok = role && allow.includes(role)
  if (!ok) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center text-muted-foreground">
        Access denied. Required role: {allow.join(" or ")}
      </div>
    )
  }
  return <>{children}</>
}
