import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Configure Neon to handle connections better
// Configure Neon to handle connections better
// Only enable connection caching in production to avoid timeouts in long-running dev processes
if (process.env.NODE_ENV === "production") {
    neonConfig.fetchConnectionCache = true;
} else {
    neonConfig.fetchConnectionCache = false;
}

// Configure Neon with proper fetch options to prevent timeout errors
const sql = neon(process.env.DATABASE_URL!, {
    fetchOptions: {
        cache: 'no-store',
    },
});

export const db = drizzle(sql, { schema });
