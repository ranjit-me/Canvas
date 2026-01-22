ALTER TABLE "webTemplate" ADD COLUMN "componentCode" text;--> statement-breakpoint
ALTER TABLE "webTemplate" ADD COLUMN "configSchema" text;--> statement-breakpoint
ALTER TABLE "webTemplate" ADD COLUMN "initialConfig" text;--> statement-breakpoint
ALTER TABLE "webTemplate" ADD COLUMN "isDynamic" boolean DEFAULT false;