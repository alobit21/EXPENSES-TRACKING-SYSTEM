// pages/api/auth/[...nextauth].ts
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions } from "next-auth";

const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
// Prefix with underscore to indicate intentionally unused
const _baseUrl = process.env.NEXTAUTH_URL || (isProd ? 'https://expenses.seranise.co.tz' : 'http://localhost:3000');

export const authOptions: AuthOptions = {
  debug: !isProd,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: `${basePath}/auth/signin`,
    error: `${basePath}/auth/error`,
    signOut: `${basePath}/auth/signout`,
  },
  
  // Theme configuration
  theme: {
    colorScheme: "light",
  },
  
  // Configure authentication providers
  providers: [
    // Credentials provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          const user = await prisma.user.findUnique({ 
            where: { email: credentials.email } 
          });
          
          if (!user) {
            throw new Error("Invalid email or password");
          }

          if (user.passwordHash === "oauth_user") {
            throw new Error("Please sign in with Google");
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.displayName || user.username,
            image: user.avatarUrl,
            role: user.role || 'USER',
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),

    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { 
          scope: "openid email profile", 
          prompt: "consent" 
        },
      },
    }),
  ],

  // Session configuration
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Use the base URL for all callbacks
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProd,
        domain: isProd ? '.seranise.co.tz' : undefined,
      },
    },
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Handle relative URLs
      if (url.startsWith('/')) {
        // Ensure we don't add the base path twice
        const cleanUrl = url.startsWith(basePath) ? url : `${basePath}${url}`;
        return new URL(cleanUrl, baseUrl).toString();
      }
      
      // Handle absolute URLs
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          return url;
        }
        // If the URL is from the same domain but different subdomain
        if (urlObj.hostname.endsWith('seranise.co.tz')) {
          return url;
        }
      } catch (e) {
        console.error('Error parsing URL in redirect callback:', e);
      }
      
      // Fallback to base URL with base path
      return new URL(basePath || '/', baseUrl).toString();
    },
    
    async session({ session, token }) {
      // Ensure the session has the correct base URL
      if (session.user) {
        session.user.id = token.sub || '';
      }
      return session;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }
};

export default NextAuth(authOptions);;
