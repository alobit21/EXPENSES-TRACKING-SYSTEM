// pages/api/auth/[...nextauth].ts
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "../../../lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  debug: true, // enable logging for troubleshooting

  providers: [
    // Credentials login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.displayName || user.username,
          image: user.avatarUrl,
        }
      },
    }),

    // Google OAuth login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: { timeout: 15000 }, // 15s timeout for network latency
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent", // ensures user can pick an account
        },
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // redirect to login on error
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Auto-create first-time Google users
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          if (!user.email) return false // Google must return email

          const existingUser = await prisma.user.findUnique({ where: { email: user.email } })

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                displayName: user.name || user.email,
                avatarUrl: user.image,
                role: "READER", // default role
                username: user.email!.split("@")[0], // use email prefix as username
              },
            })
            user.id = newUser.id.toString()
          } else {
            user.id = existingUser.id.toString()
          }
        } catch (err) {
          console.error("Error creating Google user:", err)
          return false
        }
      }
      return true
    },

    // Attach custom fields to JWT
    async jwt({ token, user }) {
      if (user?.id) {
        const dbUser = await prisma.user.findUnique({ where: { id: parseInt(user.id) } })
        token.id = user.id
        token.role = dbUser?.role
      }
      return token
    },

    // Attach custom fields to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
