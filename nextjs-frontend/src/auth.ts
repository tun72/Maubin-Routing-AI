import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authApi } from "./lib/axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const response = await authApi.post("/login", {
          email: credentials.email,
          password: credentials.password,
        });

        if (response.status !== 200) {
          return null;
        }

        response.cookies.set({
          name: "auth-token",
          value: response.data.access_token as string,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return {
          id: response.data.user.id,
          email: response.data.user.email,
          username: response.data.user.username,
          token: response.data.access_token,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
