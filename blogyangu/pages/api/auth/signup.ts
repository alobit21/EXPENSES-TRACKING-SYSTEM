// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, email, password, displayName } = req.body

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email 
          ? 'Email already exists' 
          : 'Username already exists' 
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        displayName: displayName || username,
        role: 'ADMIN' // Default role
      }
    })

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user

    res.status(201).json({ 
      message: 'User created successfully',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}