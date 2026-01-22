CREATE TABLE "webProject" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" text NOT NULL,
	"templateId" text NOT NULL,
	"json" text NOT NULL,
	"thumbnailUrl" text,
	"isPublished" boolean DEFAULT false,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "webProject" ADD CONSTRAINT "webProject_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;