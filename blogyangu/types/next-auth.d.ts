// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"


declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
        image?: string | null
        role?: string | null
    } & DefaultSession["user"]
  } 

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
  }
}