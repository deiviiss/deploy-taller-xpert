import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  rol: string;
  is_active: boolean;
  token: string;
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    newUser: '/auth/new-account'
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.data = user
      }
      return token
    },
    session({ session, token }) {
      //! fix type any
      session.user = token.data as any
      return session
    }
  },
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Parse and validate data according to the schema
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/signin`,
          {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) return null

        const user = await response.json()

        if (!user) return null

        const { password: _, ...userWithoutPassword } = user

        return userWithoutPassword
      }
    })
  ]
}

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)