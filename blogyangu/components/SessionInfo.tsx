'use client'
import { useSession } from 'next-auth/react'

export default function SessionInfo() {
  const { data: session } = useSession()
  return <div>{session ? `Hello, ${session.user.name}` : 'Not signed in'}</div>
}