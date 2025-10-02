This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





=======================================#### NextAuth Configuration ######========================================================================

You get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` by creating a **Google OAuth 2.0 Client** in the **Google Cloud Console**. Here’s a step-by-step guide:

---

### 1️⃣ Go to Google Cloud Console

* Open: [https://console.cloud.google.com/](https://console.cloud.google.com/)
* Make sure you’re logged in with the Google account you want to use.

---

### 2️⃣ Create a new project (optional)

* Click the project dropdown → **New Project** → give it a name → **Create**.
* Or use an existing project.

---

### 3️⃣ Enable OAuth & APIs

* Navigate to **APIs & Services → Credentials**.
* Click **OAuth consent screen** → choose **External** → fill in required fields:

  * App name
  * User support email
  * Developer contact email
* Save and continue.

---

### 4️⃣ Create OAuth 2.0 Client ID

* Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**
* Choose **Web application**.
* Fill in:

  * **Name**: e.g., “NextAuth Google Client”
  * **Authorized JavaScript origins**:

    ```
    http://localhost:3000   (for local dev)
    https://yourdomain.com  (for production)
    ```
  * **Authorized redirect URIs**:

    ```
    http://localhost:3000/api/auth/callback/google
    https://yourdomain.com/api/auth/callback/google
    ```
* Click **Create**.

---

### 5️⃣ Copy Client ID & Secret

* After creation, you’ll see:

  * **Client ID** → use for `GOOGLE_CLIENT_ID`
  * **Client Secret** → use for `GOOGLE_CLIENT_SECRET`
* Save them in your `.env.local`:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
NEXTAUTH_URL=http://localhost:3000
```

* Restart your Next.js dev server after updating `.env.local`.

---

Once you do this, your Google login button should correctly authenticate users and redirect them to your app instead of going back to the login page.

  ## Exaple of [...nextauth].js

  ``
  import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "../../../lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
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
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Automatically create first-time Google users
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })
          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                displayName: user.name || user.email!,
                avatarUrl: user.image,
                role: "READER", // default role
              },
            })
            // Assign the new ID to user object so jwt callback picks it up
            user.id = newUser.id.toString()
          } else {
            // Assign existing ID to user object
            user.id = existingUser.id.toString()
          }
        } catch (err) {
          console.error("Error creating Google user:", err)
          return false
        }
      }
      return true
    },

    // Attach custom fields to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // fetch role if not already set
        if (!token.role) {
          const dbUser = await prisma.user.findUnique({
            where: { id: parseInt(user.id) },
          })
          token.role = dbUser?.role
        }
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

  
  ``