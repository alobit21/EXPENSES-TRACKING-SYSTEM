import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const role = session?.user?.role
  const id = parseInt(req.query.id as string)

  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" })

  if (req.method === "GET") {
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) return res.status(404).json({ message: "Category not found" })
    return res.json(category)
  }

  // Only ADMIN
  if (!session || role !== "ADMIN") return res.status(403).json({ message: "Forbidden" })

  if (req.method === "PUT") {
    const { name, description } = req.body
    if (!name) return res.status(400).json({ message: "Name is required" })

    try {
      const category = await prisma.category.update({
        where: { id },
        data: { name, slug: makeSlug(name), description },
      })
      return res.json(category)
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(400).json({ message: "Category already exists" })
      }
      console.error(error)
      return res.status(500).json({ message: "Server error" })
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.category.delete({ where: { id } })
      return res.status(204).end()
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Server error" })
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
