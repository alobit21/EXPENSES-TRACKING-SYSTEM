// pages/api/posts/[id]/comments.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
// Remove the auth import and handle authentication manually

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  // Simple authentication check (you'll want to implement proper auth)
  const getUserIdFromRequest = (req: NextApiRequest): number | null => {
    // Implement your authentication logic here
    // This could be JWT token verification, session check, etc.
    const authHeader = req.headers.authorization
    if (!authHeader) return null
    
    // Example: Bearer token or simple user ID
    // You'll need to implement proper token verification
    try {
      const userId = parseInt(authHeader.replace('Bearer ', ''))
      return isNaN(userId) ? null : userId
    } catch {
      return null
    }
  }

  const userId = getUserIdFromRequest(req)

  if (req.method === 'GET') {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          postId: Number(id),
          status: 'APPROVED',
          parentId: null,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.status(200).json(comments)
    } catch (error) {
      console.error('Error fetching comments:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    // Add authentication check
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const { content, parentId } = req.body

 

const comment = await prisma.comment.create({
  data: {
    content,
    authorId: userId,
    postId: Number(id),
    parentId: parentId ? Number(parentId) : null,
  },
  include: {
    author: {
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      },
    },
    replies: {
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    },
    _count: {
      select: {
        likes: true,
      },
    },
  },
})

// ... rest of the code ...

      res.status(201).json(comment)
    } catch (error) {
      console.error('Error creating comment:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}