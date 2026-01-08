CREATE TABLE "webTemplate" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"thumbnail" text,
	"isFree" boolean DEFAULT true,
	"isPro" boolean DEFAULT false,
	"price" integer DEFAULT 0,
	"discount" integer DEFAULT 0,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "webProject" ADD COLUMN "country" text;