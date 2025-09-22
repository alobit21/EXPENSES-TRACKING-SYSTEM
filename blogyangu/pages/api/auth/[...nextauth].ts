// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "../../../lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.displayName || user.username,
          image: user.avatarUrl
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
  },
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id
      // Fetch role from DB
      const dbUser = await prisma.user.findUnique({
        where: { id: parseInt(user.id) },
      })
      token.role = dbUser?.role
    }
    return token
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string
      session.user.role = token.role as string
    }
    return session
  }
}

}

export default NextAuth(authOptions)