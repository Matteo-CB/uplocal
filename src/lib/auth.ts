import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  trustHost: true,
  pages: {
    signIn: "/en/auth/signin",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign in, always redirect to /en/dashboard
      if (url.includes("/auth/") || url === baseUrl || url.includes("callbackUrl")) {
        return `${baseUrl}/en/dashboard`;
      }
      // Allow relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allow URLs on the same origin
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/en/dashboard`;
    },
  },
});
