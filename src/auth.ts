import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import { compare } from "bcryptjs"

async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username }
  })
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const user = await getUserByUsername(credentials.username)
        if (!user) return null

        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) return null

        return {
          id: user.id,
          username: user.username
        }
      },
    }),
  ],
})

interface SignInCredentials {
  username: string;
  password: string;
}

// export async function signIn(credentials: SignInCredentials) {
//   try {
//     // Add your authentication logic here
//     // For example, make an API call to your backend
//     const response = await fetch('/api/auth/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//     });

//     if (!response.ok) {
//       throw new Error('Authentication failed');
//     }

//     const data = await response.json();
//     // Handle successful login (e.g., store token, redirect user)
//     return data;
//   } catch (error) {
//     console.error('Sign in error:', error);
//     throw error;
//   }
// }