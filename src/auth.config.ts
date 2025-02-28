import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials"

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        console.log({credentials});

        if(credentials.email !== "test@test.com") {
          throw new Error("Invalid email");
        }

        // return user object with their profile data
        return {
          id: "1",
          name: "John Doe",
          email: "test@test.com"
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};

export default authConfig;