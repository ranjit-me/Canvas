CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"displayOrder" integer DEFAULT 0,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "creatorApplication" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"fullName" text NOT NULL,
	"email" text NOT NULL,
	"mobile" text NOT NULL,
	"country" text NOT NULL,
	"state" text NOT NULL,
	"qualification" text NOT NULL,
	"resumeUrl" text NOT NULL,
	"profilePhotoUrl" text NOT NULL,
	"portfolioUrl" text,
	"bio" text,
	"specialization" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"adminNotes" text,
	"submittedAt" timestamp DEFAULT now() NOT NULL,
	"reviewedAt" timestamp,
	"reviewedBy" text
);
--> statement-breakpoint
CREATE TABLE "htmlTemplate" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"htmlCode" text NOT NULL,
	"cssCode" text,
	"jsCode" text,
	"creatorId" text NOT NULL,
	"category" text NOT NULL,
	"categoryId" text,
	"subcategoryId" text,
	"thumbnail" text,
	"price" integer DEFAULT 0,
	"pricingByCountry" text,
	"status" text DEFAULT 'draft',
	"isActive" boolean DEFAULT false,
	"isFree" boolean DEFAULT false,
	"editableFields" text,
	"translations" text,
	"slug" text,
	"isPublished" boolean DEFAULT false,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "htmlTemplate_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "promotionalBanner" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"price" text,
	"imageUrl" text NOT NULL,
	"linkUrl" text NOT NULL,
	"backgroundColor" text DEFAULT '#4F46E5',
	"isActive" boolean DEFAULT true,
	"displayOrder" integer DEFAULT 0,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "siteSettings" (
	"id" text PRIMARY KEY NOT NULL,
	"siteName" text DEFAULT 'Giftora' NOT NULL,
	"siteLogo" text,
	"contactEmail" text,
	"contactPhone" text,
	"contactAddress" text,
	"aboutUsContent" text,
	"socialLinks" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subcategory" (
	"id" text PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"displayOrder" integer DEFAULT 0,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templateAsset" (
	"id" text PRIMARY KEY NOT NULL,
	"templateId" text NOT NULL,
	"fileName" text NOT NULL,
	"fileUrl" text NOT NULL,
	"fileType" text NOT NULL,
	"fileSize" integer,
	"elementId" text,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templateCustomization" (
	"id" text PRIMARY KEY NOT NULL,
	"templateId" text NOT NULL,
	"userId" text NOT NULL,
	"customData" text NOT NULL,
	"customAssets" text,
	"slug" text,
	"isPublished" boolean DEFAULT false,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "templateCustomization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "templateReview" (
	"id" text PRIMARY KEY NOT NULL,
	"templateId" text NOT NULL,
	"userId" text NOT NULL,
	"userName" text NOT NULL,
	"userEmail" text NOT NULL,
	"rating" integer NOT NULL,
	"reviewText" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "creatorStatus" text DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "webTemplate" ADD COLUMN "categoryId" text;--> statement-breakpoint
ALTER TABLE "webTemplate" ADD COLUMN "subcategoryId" text;--> statement-breakpoint
ALTER TABLE "webTemplate" ADD COLUMN "translations" text;--> statement-breakpoint
ALTER TABLE "creatorApplication" ADD CONSTRAINT "creatorApplication_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creatorApplication" ADD CONSTRAINT "creatorApplication_reviewedBy_user_id_fk" FOREIGN KEY ("reviewedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "htmlTemplate" ADD CONSTRAINT "htmlTemplate_creatorId_user_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "htmlTemplate" ADD CONSTRAINT "htmlTemplate_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "htmlTemplate" ADD CONSTRAINT "htmlTemplate_subcategoryId_subcategory_id_fk" FOREIGN KEY ("subcategoryId") REFERENCES "public"."subcategory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templateAsset" ADD CONSTRAINT "templateAsset_templateId_htmlTemplate_id_fk" FOREIGN KEY ("templateId") REFERENCES "public"."htmlTemplate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templateCustomization" ADD CONSTRAINT "templateCustomization_templateId_htmlTemplate_id_fk" FOREIGN KEY ("templateId") REFERENCES "public"."htmlTemplate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templateCustomization" ADD CONSTRAINT "templateCustomization_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templateReview" ADD CONSTRAINT "templateReview_templateId_webTemplate_id_fk" FOREIGN KEY ("templateId") REFERENCES "public"."webTemplate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templateReview" ADD CONSTRAINT "templateReview_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webTemplate" ADD CONSTRAINT "webTemplate_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webTemplate" ADD CONSTRAINT "webTemplate_subcategoryId_subcategory_id_fk" FOREIGN KEY ("subcategoryId") REFERENCES "public"."subcategory"("id") ON DELETE no action ON UPDATE no action;