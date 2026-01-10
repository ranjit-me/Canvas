import { z } from "zod";
import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { eq, desc } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

const app = new Hono()
  // Get all users
  .get("/", async (c) => {
    try {
      const allUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
          creatorStatus: users.creatorStatus,
        })
        .from(users);

      // Add a fake createdAt for UI compatibility (you can add this field to schema later)
      const usersWithDate = allUsers.map(user => ({
        ...user,
        createdAt: new Date(), // Placeholder - all users will show as "today"
      }));

      return c.json({ users: usersWithDate });
    } catch (error) {
      console.error("Error fetching users:", error);
      return c.json({ error: "Failed to fetch users" }, 500);
    }
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(3).max(20),
      })
    ),
    async (c) => {
      const { name, email, password } = c.req.valid("json");

      const hashedPassword = await bcrypt.hash(password, 12);

      const query = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (query[0]) {
        return c.json({ error: "Email already in use" }, 400);
      }

      await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
      });

      return c.json(null, 200);
    },
  );

export default app;
