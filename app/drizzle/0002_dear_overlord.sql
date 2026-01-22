ALTER TABLE "webProject" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "webProject" ADD CONSTRAINT "webProject_slug_unique" UNIQUE("slug");