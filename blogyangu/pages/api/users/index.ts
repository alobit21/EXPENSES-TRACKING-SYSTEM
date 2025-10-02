import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any)
  // Allow public GET; admin-only for mutations
  if (req.method !== "GET") {
    const role = (session as any)?.user?.role
    if (!role || role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" })
    }
  }

  try {
    if (req.method === "GET") {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          isVerified: true,
        },
      })
      return res.status(200).json(users)
    }

    if (req.method === "POST") {
      const role = (session as any)?.user?.role
      if (!role || role !== "ADMIN") return res.status(403).json({ message: "Forbidden" })
      const { username, email, password, role: newRole = "AUTHOR", displayName } = req.body || {}
      if (!username || !email || !password) return res.status(400).json({ message: "username, email and password are required" })
      const salt = crypto.randomBytes(16).toString("hex")
      const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex")
      const passwordHash = `scrypt:${salt}:${derivedKey}`
      try {
        const user = await prisma.user.create({
          data: { username, email, passwordHash, role: newRole, displayName: displayName || null },
          select: { id: true, username: true, email: true, role: true, displayName: true, createdAt: true },
        })
        return res.status(201).json(user)
      } catch (e: any) {
        if (e?.code === "P2002") return res.status(409).json({ message: "Username or email already exists" })
        throw e
      }
    }

    return res.status(405).json({ message: "Method Not Allowed" })
  } catch (e: any) {
    console.error("/api/users error:", e)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
