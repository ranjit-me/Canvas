ALTER TABLE "siteSettings" ADD COLUMN "defaultTemplateLanguage" text DEFAULT 'en';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "templateLanguage" text;