ALTER TABLE "webProject" ADD COLUMN "paymentStatus" text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "webProject" ADD COLUMN "razorpayOrderId" text;--> statement-breakpoint
ALTER TABLE "webProject" ADD COLUMN "razorpayPaymentId" text;--> statement-breakpoint
ALTER TABLE "webProject" ADD COLUMN "pricePaid" integer;