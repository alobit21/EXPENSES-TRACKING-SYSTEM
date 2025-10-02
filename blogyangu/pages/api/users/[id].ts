import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any)
  const role = (session as any)?.user?.role
  if (!role || role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" })
  }

  const idNum = Number(req.query.id)
  if (!idNum) return res.status(400).json({ message: "Invalid id" })

  try {
    if (req.method === "PUT") {
      const { username, email, displayName, role: newRole, password } = (req.body || {}) as any
      const data: any = {}
      if (typeof username !== "undefined") data.username = username
      if (typeof email !== "undefined") data.email = email
      if (typeof displayName !== "undefined") data.displayName = displayName
      if (typeof newRole !== "undefined") data.role = newRole
      if (password) {
        const salt = crypto.randomBytes(16).toString("hex")
        const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex")
        data.passwordHash = `scrypt:${salt}:${derivedKey}`
      }
      try {
        const user = await prisma.user.update({
          where: { id: idNum },
          data,
          select: { id: true, username: true, email: true, role: true, displayName: true, updatedAt: true },
        })
        return res.status(200).json(user)
      } catch (e: any) {
        if (e?.code === "P2002") return res.status(409).json({ message: "Username or email already exists" })
        throw e
      }
    }

    if (req.method === "DELETE") {
      await prisma.user.delete({ where: { id: idNum } })
      return res.status(204).end()
    }

    return res.status(405).json({ message: "Method Not Allowed" })
  } catch (e) {
    console.error("/api/users/[id] error:", e)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
