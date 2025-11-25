import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../../../prisma/client"
import bcrypt from "bcrypt"


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          }
        })
        if (!user) return null
        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword!)


        return passwordMatch ? user : null;
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account, user }) {
      // On initial sign-in, capture the user ID
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass user ID from JWT token to session
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }