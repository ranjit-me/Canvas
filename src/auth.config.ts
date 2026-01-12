import { z } from "zod";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { eq } from "drizzle-orm";
import { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    creatorStatus?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    creatorStatus?: string | null;
  }
}

export default {
  trustHost: true,
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        pasword: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = CredentialsSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const query = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        const user = query[0];

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.password,
        );

        if (!passwordsMatch) {
          return null;
        }

        return user;
      },
    }),
    GitHub,
    Google
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      if (token.creatorStatus) {
        session.user.creatorStatus = token.creatorStatus;
      }

      return session;
    },
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.creatorStatus = user.creatorStatus;
      } else if (token.id) {
        // Refresh creator status from DB for subsequent requests
        try {
          const [freshUser] = await db
            .select({ creatorStatus: users.creatorStatus })
            .from(users)
            .where(eq(users.id, token.id as string));

          if (freshUser) {
            token.creatorStatus = freshUser.creatorStatus;
          }
        } catch (error) {
          console.error("Error refreshing user status:", error);
        }
      }

      return token;
    }
  },
} satisfies NextAuthConfig

