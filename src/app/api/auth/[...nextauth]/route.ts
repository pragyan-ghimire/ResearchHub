import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../../../prisma/client"
import bcrypt from "bcrypt"


export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    // Credentials({
    //   credentials: {
    //     email: {
    //       type: "email",
    //       label: "Email",
    //       placeholder: "johndoe@gmail.com",
    //     },
    //     password: {
    //       type: "password",
    //       label: "Password",
    //       placeholder: "*****",
    //     },
    //   },
    //   authorize: async (credentials) => {
    //     if (!credentials?.email || !credentials?.password) return null
    //     const user = await prisma.user.findUnique({
    //       where: {
    //         email: credentials.email,
    //       }
    //     })
    //     if (!user) return null
    //     const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword!)


    //     return passwordMatch ? user : null;
    //   },
    // }),
  ],
//   session: { strategy: "jwt" },
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }