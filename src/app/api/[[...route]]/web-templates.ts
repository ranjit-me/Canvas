import { z } from "zod";
import { Hono } from "hono";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { webTemplates, webTemplatesInsertSchema, webProjects, templateReviews, htmlTemplates, categories, subcategories } from "@/db/schema";
import { transformTemplateCode } from "@/lib/template-converter";
import fs from "fs";
import path from "path";
import { or } from "drizzle-orm";

// Helper to enrich templates with ratings
async function enrichWithRatings(templates: any[]) {
    if (templates.length === 0) return templates;
    const templateIds = templates.map(t => t.id);

    // Get aggregated ratings
    const ratings = await db
        .select({
            templateId: templateReviews.templateId,
            avgRating: sql<number>`CAST(AVG(${templateReviews.rating}) AS DECIMAL(10,1))`,
            reviewsCount: sql<number>`COUNT(*)`
        })
        .from(templateReviews)
        .where(inArray(templateReviews.templateId, templateIds))
        .groupBy(templateReviews.templateId);

    // Merge with templates
    return templates.map(t => {
        const stats = ratings.find(r => r.templateId === t.id);
        return {
            ...t,
            rating: stats ? Number(stats.avgRating) : 0,
            reviewsCount: stats ? Number(stats.reviewsCount) : 0
        };
    });
}

// Helper to merge templates from both webTemplates and htmlTemplates
async function mergeTemplates(options: {
    categoryFilter?: string;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt';
    includeInactive?: boolean;
} = {}) {
    const { categoryFilter, limit, sortBy = 'createdAt', includeInactive = false } = options;

    // Fetch React templates
    let webQuery = db.select().from(webTemplates);
    const webConditions = [];

    if (!includeInactive) {
        webConditions.push(eq(webTemplates.isActive, true));
    }
    if (categoryFilter) {
        webConditions.push(eq(webTemplates.category, categoryFilter));
    }

    const webResults = await webQuery
        .where(webConditions.length > 0 ? and(...webConditions) : undefined)
        .orderBy(desc(webTemplates[sortBy]));

    // Fetch HTML templates
    let htmlQuery = db.select().from(htmlTemplates);
    const htmlConditions = [];

    if (!includeInactive) {
        // Include approved AND pending (if auto-approved logic is used, they are approved anyway)
        // But for completeness, we check isActive which is the source of truth
        htmlConditions.push(eq(htmlTemplates.isActive, true));
    }
    if (categoryFilter) {
        // For HTML templates, also try to match by categoryId/subcategoryId
        // First get the category by looking it up
        const matchingCategories = await db
            .select()
            .from(categories)
            .where(or(
                eq(categories.id, categoryFilter),
                eq(categories.name, categoryFilter)
            ));

        const matchingSubcategories = await db
            .select()
            .from(subcategories)
            .where(or(
                eq(subcategories.id, categoryFilter),
                eq(subcategories.name, categoryFilter)
            ));

        const categoryIds = matchingCategories.map(c => c.id);
        const subcategoryIds = matchingSubcategories.map(s => s.id);

        const filterConditions = [eq(htmlTemplates.category, categoryFilter)];
        if (categoryIds.length > 0) {
            filterConditions.push(inArray(htmlTemplates.categoryId, categoryIds));
        }
        if (subcategoryIds.length > 0) {
            filterConditions.push(inArray(htmlTemplates.subcategoryId, subcategoryIds));
        }

        htmlConditions.push(or(...filterConditions));
    }

    const htmlResults = await htmlQuery
        .where(htmlConditions.length > 0 ? and(...htmlConditions) : undefined)
        .orderBy(desc(htmlTemplates[sortBy]));

    // Normalize HTML templates to match webTemplates structure
    const normalizedHtmlTemplates = htmlResults.map(template => ({
        ...template,
        type: 'html' as const,
        isHtmlTemplate: true,
        // Ensure these fields exist for compatibility
        videoUrl: null,
        isPro: !template.isFree,
        pricingByCountry: template.pricingByCountry || null,
        // Populate componentCode for UniversalTemplateLoader
        // We wrap CSS in style tags and transform HTML to be editable
        componentCode: `<style>${template.cssCode || ''}</style>\n${transformTemplateCode(template.htmlCode)}`,
        configSchema: null,
        initialConfig: null,
        isDynamic: true,
        discount: 0,
    }));

    // Add type to webTemplates
    const normalizedWebTemplates = webResults.map(template => ({
        ...template,
        type: 'react' as const,
        isHtmlTemplate: false,
    }));

    // Merge and sort
    const merged = [...normalizedWebTemplates, ...normalizedHtmlTemplates]
        .sort((a, b) => new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime());

    // Apply limit if specified
    return limit ? merged.slice(0, limit) : merged;
}

const app = new Hono()
    .get(
        "/stats",
        // verifyAuth(),
        async (c) => {
            // In a real app, you'd check if the user is an admin.
            // For this task, we assume the authorized user has access.

            const [totalProjects] = await db
                .select({ count: sql<number>`count(*)` })
                .from(webProjects);

            const countryStats = await db
                .select({
                    country: webProjects.country,
                    count: sql<number>`count(*)`
                })
                .from(webProjects)
                .groupBy(webProjects.country)
                .orderBy(desc(sql`count(*)`));

            const templateUsage = await db
                .select({
                    templateId: webProjects.templateId,
                    count: sql<number>`count(*)`
                })
                .from(webProjects)
                .groupBy(webProjects.templateId);

            return c.json({
                totalOrders: totalProjects.count,
                countryStats,
                templateUsage
            });
        }
    )
    .post(
        "/sync",
        // verifyAuth(),
        async (c) => {
            // Hardcoded initial templates to seed the DB - ONLY WORKING TEMPLATES
            const initialTemplates = [
                // GIRLFRIEND CATEGORY
                {
                    id: "rose-birthday",
                    name: "Romantic Rose Dreams",
                    description: "Elegant rose-themed birthday website with animated petals, countdown timer, and photo gallery",
                    category: "birthday-girlfriend",
                    thumbnail: "https://images.unsplash.com/photo-1611594167606-6ba5cb6510f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                    isFree: false,
                    isPro: true,
                    price: 299,
                },
                {
                    id: "dreamy-pink-paradise",
                    name: "Dreamy Pink Paradise",
                    description: "Soft pink gradient design with countdown timer and love notes for your special one",
                    category: "birthday-girlfriend",
                    thumbnail: "https://images.unsplash.com/photo-1707035091770-4c548c02e5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                    isFree: false,
                    isPro: true,
                    price: 349,
                },
                {
                    id: "midnight-promise-girlfriend",
                    name: "Midnight Promise",
                    description: "Interactive multi-step birthday experience with memory unlock, countdown, and heartfelt messages",
                    category: "birthday-girlfriend",
                    thumbnail: "https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMHN1bnNldHxlbnwxfHx8fDE3NjY3MTMzMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    isFree: false,
                    isPro: true,
                    price: 399,
                },
                // BOYFRIEND CATEGORY
                {
                    id: "rose-birthday-boyfriend",
                    name: "Romantic Rose Dreams",
                    description: "Elegant rose-themed birthday website with animated petals, countdown timer, and photo gallery",
                    category: "birthday-boyfriend",
                    thumbnail: "https://images.unsplash.com/photo-1611594167606-6ba5cb6510f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                    isFree: false,
                    isPro: true,
                    price: 299,
                },
                {
                    id: "dreamy-pink-paradise-boyfriend",
                    name: "Dreamy Pink Paradise",
                    description: "Soft pink gradient design with countdown timer and love notes for your special one",
                    category: "birthday-boyfriend",
                    thumbnail: "https://images.unsplash.com/photo-1707035091770-4c548c02e5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                    isFree: false,
                    isPro: true,
                    price: 349,
                },
                {
                    id: "midnight-promise-boyfriend",
                    name: "Midnight Promise",
                    description: "Interactive multi-step birthday experience with memory unlock, countdown, and heartfelt messages",
                    category: "birthday-boyfriend",
                    thumbnail: "https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMHN1bnNldHxlbnwxfHx8fDE3NjY3MTMzMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    isFree: false,
                    isPro: true,
                    price: 399,
                },
            ];

            // First, deactivate ALL existing templates
            await db
                .update(webTemplates)
                .set({ isActive: false, updatedAt: new Date() });

            // Then sync only the working templates
            for (const template of initialTemplates) {
                const existing = await db
                    .select()
                    .from(webTemplates)
                    .where(eq(webTemplates.id, template.id))
                    .limit(1);

                if (existing.length === 0) {
                    await db.insert(webTemplates).values({
                        id: template.id,
                        name: template.name,
                        description: template.description,
                        thumbnail: template.thumbnail,
                        price: template.price,
                        isFree: template.isFree,
                        isPro: template.isPro,
                        category: template.category,
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                } else {
                    await db
                        .update(webTemplates)
                        .set({
                            name: template.name,
                            description: template.description,
                            thumbnail: template.thumbnail,
                            price: template.price,
                            isFree: template.isFree,
                            isPro: template.isPro,
                            category: template.category,
                            isActive: true,
                            updatedAt: new Date(),
                        })
                        .where(eq(webTemplates.id, template.id));
                }
            }

            return c.json({ message: "Templates synced successfully", count: initialTemplates.length });
        }
    )
    .get(
        "/trending",
        async (c) => {
            // Get templates with order count (most ordered templates)
            const templateUsage = await db
                .select({
                    templateId: webProjects.templateId,
                    count: sql<number>`count(*)::int`
                })
                .from(webProjects)
                .groupBy(webProjects.templateId)
                .orderBy(desc(sql`count(*)`))
                .limit(10);

            // Get full template details for trending templates
            const templateIds = templateUsage.map(t => t.templateId);

            if (templateIds.length === 0) {
                // If no orders yet, get latest templates from both sources
                const fallbackTemplates = await mergeTemplates({
                    sortBy: 'createdAt',
                    limit: 10,
                });
                const enriched = await enrichWithRatings(fallbackTemplates);
                return c.json({ data: enriched });
            }

            // Fetch from webTemplates
            const webTemplatesData = await db
                .select()
                .from(webTemplates)
                .where(
                    and(
                        eq(webTemplates.isActive, true),
                        inArray(webTemplates.id, templateIds)
                    )
                );

            // Fetch from htmlTemplates (in case any trending ones are HTML)
            const htmlTemplatesData = await db
                .select()
                .from(htmlTemplates)
                .where(
                    and(
                        eq(htmlTemplates.isActive, true),
                        inArray(htmlTemplates.id, templateIds)
                    )
                );

            // Normalize HTML templates
            const normalizedHtml = htmlTemplatesData.map(template => ({
                ...template,
                type: 'html' as const,
                isHtmlTemplate: true,
                videoUrl: null,
                isPro: !template.isFree,
                pricingByCountry: template.pricingByCountry || null,
                componentCode: `<style>${template.cssCode || ''}</style>\n${transformTemplateCode(template.htmlCode)}`,
                configSchema: null,
                initialConfig: null,
                isDynamic: true,
                discount: 0,
            }));

            const normalizedWeb = webTemplatesData.map(template => ({
                ...template,
                type: 'react' as const,
                isHtmlTemplate: false,
            }));

            const allTemplates = [...normalizedWeb, ...normalizedHtml];

            // Merge usage count with template data
            const enrichedTemplates = await enrichWithRatings(allTemplates);

            const trendingTemplates = enrichedTemplates.map(template => {
                const usage = templateUsage.find(u => u.templateId === template.id);
                return {
                    ...template,
                    orderCount: usage?.count || 0
                };
            }).sort((a, b) => b.orderCount - a.orderCount);

            return c.json({ data: trendingTemplates });
        }
    )
    .get(
        "/latest",
        async (c) => {
            // Get recently added templates from both sources
            const templates = await mergeTemplates({
                sortBy: 'createdAt',
                limit: 12,
            });

            const data = await enrichWithRatings(templates);
            return c.json({ data });
        }
    )
    .get(
        "/by-category/:category",
        zValidator(
            "param",
            z.object({ category: z.string() })
        ),
        async (c) => {
            const { category } = c.req.valid("param");

            const templates = await mergeTemplates({
                categoryFilter: category,
            });

            const data = await enrichWithRatings(templates);
            return c.json({ data });
        }
    )
    .get(
        "/",
        async (c) => {
            const templates = await mergeTemplates({
                sortBy: 'updatedAt',
            });

            const data = await enrichWithRatings(templates);
            return c.json({ data });
        }
    )
    .get(
        "/admin",
        // verifyAuth(),
        async (c) => {
            const templates = await mergeTemplates({
                sortBy: 'updatedAt',
                includeInactive: true,
            });

            const data = await enrichWithRatings(templates);
            return c.json({ data });
        }
    )
    .get(
        "/:id",
        zValidator(
            "param",
            z.object({ id: z.string() })
        ),
        async (c) => {
            const { id } = c.req.valid("param");

            const [data] = await db
                .select()
                .from(webTemplates)
                .where(eq(webTemplates.id, id))
                .limit(1);

            if (data) {
                return c.json({ data });
            }

            // Fallback: Check htmlTemplates
            const [htmlData] = await db
                .select()
                .from(htmlTemplates)
                .where(eq(htmlTemplates.id, id))
                .limit(1);

            if (htmlData) {
                // Normalize HTML template to match webTemplates structure
                const normalized = {
                    ...htmlData,
                    type: 'html' as const,
                    isHtmlTemplate: true,
                    videoUrl: null,
                    isPro: !htmlData.isFree,
                    pricingByCountry: htmlData.pricingByCountry || null,
                    // Populate componentCode for UniversalTemplateLoader
                    componentCode: `<style>${htmlData.cssCode || ''}</style>\n${transformTemplateCode(htmlData.htmlCode)}`,
                    configSchema: null,
                    initialConfig: null,
                    isDynamic: true,
                    discount: 0,
                };
                return c.json({ data: normalized });
            }

            return c.json({ error: "Not found" }, 404);
        }
    )
    .post(
        "/creator",
        zValidator(
            "json",
            z.object({
                name: z.string(),
                category: z.string(),
                price: z.coerce.number(),
                description: z.string().optional(),
                componentCode: z.string(),
                configSchema: z.string().optional(),
                initialConfig: z.string().optional(),
            })
        ),
        async (c) => {
            const {
                name,
                category,
                price,
                description,
                componentCode: rawCode,
                configSchema,
                initialConfig
            } = c.req.valid("json");

            // Transform raw code into "Smart Edit" code
            const componentCode = transformTemplateCode(rawCode);

            // Generate a unique ID for the template
            const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            const id = slug + "-" + Math.random().toString(36).substring(2, 7);

            // CREATE REAL FILE (as requested by user)
            try {
                const templateDir = path.join(process.cwd(), "src/features/web-projects/templates", slug);
                if (!fs.existsSync(templateDir)) {
                    fs.mkdirSync(templateDir, { recursive: true });
                }
                const filePath = path.join(templateDir, `${slug}.tsx`);

                // APPLY SHIMS to final file too
                const shimmedCode = rawCode
                    .replace(/from ['"]motion\/react['"]/g, "from 'framer-motion'")
                    .replace(/from ['"]react-confetti['"]/g, "from 'canvas-confetti'");

                fs.writeFileSync(filePath, shimmedCode);
            } catch (err) {
                console.error("Failed to write physical template file:", err);
                // We continue even if file writing fails, as DB entry is the primary source of truth for the builder
            }

            const data = await db.insert(webTemplates).values({
                id,
                name,
                category,
                price,
                description,
                componentCode,
                configSchema,
                initialConfig,
                isDynamic: true,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();

            return c.json({ data: data[0] });
        }
    )
    .post(
        "/sandbox",
        zValidator(
            "json",
            z.object({
                slug: z.string(),
                codeContent: z.string(),
            })
        ),
        async (c) => {
            const { slug, codeContent: rawCode } = c.req.valid("json");

            // Clean up the name for a filename
            const fileName = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            const sandboxDir = path.join(process.cwd(), "src/features/web-projects/templates/sandbox");

            // Ensure directory exists
            if (!fs.existsSync(sandboxDir)) {
                fs.mkdirSync(sandboxDir, { recursive: true });
            }

            // AUTO-SHIM IMPORTS (Fix for motion/react and other mismatches)
            let codeContent = rawCode
                .replace(/from ['"]motion\/react['"]/g, "from 'framer-motion'");

            const filePath = path.join(sandboxDir, `${fileName}.tsx`);

            // Write the file
            fs.writeFileSync(filePath, codeContent);

            return c.json({ success: true, path: `/creator/preview/sandbox/${fileName}` });
        }
    )
    .patch(
        "/:id",
        // verifyAuth(),
        zValidator(
            "param",
            z.object({ id: z.string() }),
        ),
        zValidator(
            "json",
            webTemplatesInsertSchema
                .omit({
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                })
                .partial()
        ),
        async (c) => {
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");

            const data = await db
                .update(webTemplates)
                .set({
                    ...values,
                    updatedAt: new Date(),
                })
                .where(eq(webTemplates.id, id))
                .returning();

            if (data.length === 0) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data: data[0] });
        },
    )
    .delete(
        "/:id",
        // verifyAuth(),
        async (c) => {
            const { id } = c.req.param();

            const existing = await db
                .select()
                .from(webTemplates)
                .where(eq(webTemplates.id, id))
                .limit(1);

            if (existing.length === 0) {
                return c.json({ error: "Not found" }, 404);
            }

            await db.delete(webTemplates).where(eq(webTemplates.id, id));

            return c.json({ success: true });
        }
    );

export default app;
