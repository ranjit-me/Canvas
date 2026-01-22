-- Create template reviews table
CREATE TABLE IF NOT EXISTS "templateReview" (
  "id" text PRIMARY KEY NOT NULL,
  "templateId" text NOT NULL REFERENCES "webTemplate"("id") ON DELETE CASCADE,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "userName" text NOT NULL,
  "userEmail" text NOT NULL,
  "rating" integer NOT NULL,
  "reviewText" text,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "templateReview_templateId_idx" ON "templateReview"("templateId");
CREATE INDEX IF NOT EXISTS "templateReview_userId_idx" ON "templateReview"("userId");
CREATE INDEX IF NOT EXISTS "templateReview_createdAt_idx" ON "templateReview"("createdAt");
