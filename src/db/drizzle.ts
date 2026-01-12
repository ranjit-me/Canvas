import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Neon connection configuration

// Configure Neon with proper fetch options to prevent timeout errors
const sql = neon(process.env.DATABASE_URL!, {
    fetchOptions: {
        cache: 'no-store',
    },
});

export const db = drizzle(sql, { schema });
