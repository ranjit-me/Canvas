import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            creatorStatus?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        creatorStatus?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        creatorStatus?: string | null;
    }
}
