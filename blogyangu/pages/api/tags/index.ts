import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any)
  const role = (session as any)?.user?.role
  try {
    if (req.method === "GET") {
      const tags = await prisma.tag.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, slug: true, createdAt: true },
      })
      return res.status(200).json(tags)
    }

    if (req.method === "POST") {
      if (!role || role !== "ADMIN") return res.status(403).json({ message: "Forbidden" })
      const { name, slug } = req.body || {}
      if (!name || !slug) return res.status(400).json({ message: "name and slug are required" })
      try {
        const tag = await prisma.tag.create({ data: { name, slug }, select: { id: true, name: true, slug: true, createdAt: true } })
        return res.status(201).json(tag)
      } catch (e: any) {
        if (e?.code === "P2002") return res.status(409).json({ message: "Tag name or slug already exists" })
        throw e
      }
    }

    if (req.method === "DELETE") {
      if (!role || role !== "ADMIN") return res.status(403).json({ message: "Forbidden" })
      const { id } = req.body || {}
      if (!id) return res.status(400).json({ message: "id is required" })
      await prisma.tag.delete({ where: { id: Number(id) } })
      return res.status(204).end()
    }

    return res.status(405).json({ message: "Method Not Allowed" })
  } catch (e) {
    console.error("/api/tags error:", e)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
