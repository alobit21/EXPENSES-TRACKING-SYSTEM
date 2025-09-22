// pages/api/likes.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple authentication check
  const getUserIdFromRequest = (req: NextApiRequest): number | null => {
    const authHeader = req.headers.authorization
    if (!authHeader) return null
    
    try {
      const userId = parseInt(authHeader.replace('Bearer ', ''))
      return isNaN(userId) ? null : userId
    } catch {
      return null
    }
  }

  const userId = getUserIdFromRequest(req)

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      const { postId, commentId } = req.body

      // Check if like already exists
      const existingLike = await prisma.like.findFirst({
        where: {
          userId: userId,
          postId: postId || null,
          commentId: commentId || null,
        },
      })

      if (existingLike) {
        // Unlike if already liked
        await prisma.like.delete({
          where: { id: existingLike.id },
        })
        return res.status(200).json({ liked: false })
      } else {
        // Create new like
        await prisma.like.create({
          data: {
            userId: userId,
            postId: postId || null,
            commentId: commentId || null,
          },
        })
        return res.status(201).json({ liked: true })
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}