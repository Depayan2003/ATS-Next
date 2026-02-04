import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDb from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export const authOptions = {
  providers: [
    CredentialsProvider({
        id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDb();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.isActive) {
          throw new Error("Account disabled");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // WHAT GETS STORED IN SESSION / JWT
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
