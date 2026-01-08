import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";
import { db } from "@/db/drizzle";
import { webProjects, webTemplates, htmlTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono()
    /**
     * Migrate existing projects to add thumbnailUrl from their templates
     * GET /api/migrate-thumbnails
     */
    .get(
        "/",
        verifyAuth(),
        async (c) => {
            try {
                const auth = c.get("authUser");
                if (!auth.token?.id) {
                    return c.json({ error: "Unauthorized" }, 401);
                }

                // Get all projects without thumbnailUrl for this user
                const projects = await db
                    .select()
                    .from(webProjects)
                    .where(eq(webProjects.userId, auth.token.id));

                let updated = 0;
                let errors: string[] = [];

                for (const project of projects) {
                    try {
                        // Skip if already has thumbnail
                        if (project.thumbnailUrl) continue;

                        const templateId = project.templateId;
                        let thumbnailUrl: string | null = null;

                        // Check if it's an HTML template
                        if (templateId.startsWith("html-")) {
                            const htmlTemplate = await db.query.htmlTemplates.findFirst({
                                where: eq(htmlTemplates.id, templateId),
                            });
                            thumbnailUrl = htmlTemplate?.thumbnail || null;
                        } else {
                            // It's a web template
                            const webTemplate = await db.query.webTemplates.findFirst({
                                where: eq(webTemplates.id, templateId),
                            });
                            thumbnailUrl = webTemplate?.thumbnail || null;
                        }

                        // Update project if thumbnail found
                        if (thumbnailUrl) {
                            await db
                                .update(webProjects)
                                .set({ thumbnailUrl })
                                .where(eq(webProjects.id, project.id));
                            updated++;
                        }
                    } catch (error) {
                        console.error(`Error updating project ${project.id}:`, error);
                        errors.push(`Project ${project.id}: ${error}`);
                    }
                }

                return c.json({
                    message: "Migration completed",
                    totalProjects: projects.length,
                    updated,
                    errors: errors.length > 0 ? errors : undefined,
                });
            } catch (error) {
                console.error("Migration error:", error);
                return c.json({ error: "Migration failed", details: String(error) }, 500);
            }
        }
    );

export default app;
