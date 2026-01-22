CREATE TABLE "userLead" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"mobile" text NOT NULL,
	"whatsapp" text,
	"country" text NOT NULL,
	"state" text,
	"interests" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userLead" ADD CONSTRAINT "userLead_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;