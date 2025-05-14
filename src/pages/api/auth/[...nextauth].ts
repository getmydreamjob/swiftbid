ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // Corrected import path
import { compare } from "bcrypt";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
      async authorize(creds) {
        if (!creds) return null; // Add null check
        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (user && user.passwordHash && await compare(creds.password, user.passwordHash)) {
          return user;
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // The user object is only available when using JWT sessions or a database adapter.
      // Since we are using a database adapter, the user object will be available.
      if (session.user) {
        session.user.id = user.id;
        // Assuming the user object from the adapter includes the role
        // You might need to select the role in the authorize function if using credentials
        // or ensure your Prisma User model is correctly used by the adapter.
        (session.user as any).role = (user as any).role; // Cast to any to add role
      }
      return session;
    },
    // Add jwt callback if you plan to use JWT sessions in addition to database sessions
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     (token as any).role = (user as any).role;
    //   }
    //   return token;
    // },
  },
  // Specify pages
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave null if not wanted)
  },
});