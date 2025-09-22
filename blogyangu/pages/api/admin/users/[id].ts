import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authorize } from "../../../../lib/authorize"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await authorize(req, res, ["ADMIN"])
  if (!session) return

  const userId = parseInt(req.query.id as string)

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    return res.json(user)
  }

  if (req.method === "PUT") {
    const { username, email, role } = req.body
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email, role },
    })
    return res.json(updatedUser)
  }

  if (req.method === "DELETE") {
    await prisma.user.delete({ where: { id: userId } })
    return res.status(204).end()
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
