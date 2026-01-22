import { pgTable, foreignKey, text, integer, timestamp, boolean, index, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const subcategory = pgTable("subcategory", {
	id: text().primaryKey().notNull(),
	categoryId: text().notNull(),
	name: text().notNull(),
	description: text(),
	icon: text(),
	displayOrder: integer().default(0),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [category.id],
			name: "subcategory_categoryId_fkey"
		}).onDelete("cascade"),
]);

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const webTemplate = pgTable("webTemplate", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	category: text().notNull(),
	thumbnail: text(),
	isFree: boolean().default(true),
	isPro: boolean().default(false),
	price: integer().default(0),
	discount: integer().default(0),
	isActive: boolean().default(true),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
	pricingByCountry: text(),
	videoUrl: text(),
	componentCode: text(),
	isDynamic: boolean().default(false),
	configSchema: text(),
	initialConfig: text(),
	categoryId: text(),
	subcategoryId: text(),
	translations: text(),
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	password: text(),
	creatorStatus: text().default('none'),
}, (table) => [
	index("idx_user_creator_status").using("btree", table.creatorStatus.asc().nullsLast().op("text_ops")),
]);

export const webProject = pgTable("webProject", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	userId: text().notNull(),
	templateId: text().notNull(),
	json: text().notNull(),
	thumbnailUrl: text(),
	isPublished: boolean().default(false),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
	slug: text(),
	country: text(),
	paymentStatus: text().default('pending'),
	razorpayOrderId: text(),
	razorpayPaymentId: text(),
	pricePaid: integer(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "webProject_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("webProject_slug_unique").on(table.slug),
]);

export const category = pgTable("category", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	icon: text(),
	displayOrder: integer().default(0),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	unique("category_name_key").on(table.name),
]);

export const userLead = pgTable("userLead", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	mobile: text().notNull(),
	whatsapp: text(),
	country: text().notNull(),
	state: text(),
	interests: text(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
	countryCode: text(),
	ipAddress: text(),
});

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const siteSettings = pgTable("siteSettings", {
	id: text().primaryKey().notNull(),
	siteName: text().default('Giftora').notNull(),
	siteLogo: text(),
	contactEmail: text(),
	contactPhone: text(),
	contactAddress: text(),
	aboutUsContent: text(),
	socialLinks: text(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
});

export const promotionalBanner = pgTable("promotionalBanner", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	subtitle: text(),
	price: text(),
	imageUrl: text().notNull(),
	linkUrl: text().notNull(),
	backgroundColor: text().default('#4F46E5'),
	isActive: boolean().default(true),
	displayOrder: integer().default(0),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
});

export const verificationToken = pgTable("verificationToken", {
	verificationToken: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
});

export const authenticator = pgTable("authenticator", {
	credentialId: text().notNull(),
	userId: text().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: boolean().notNull(),
	transports: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "authenticator_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const templateReview = pgTable("templateReview", {
	id: text().primaryKey().notNull(),
	templateId: text().notNull(),
	userId: text().notNull(),
	userName: text().notNull(),
	userEmail: text().notNull(),
	rating: integer().notNull(),
	reviewText: text(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("templateReview_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("templateReview_templateId_idx").using("btree", table.templateId.asc().nullsLast().op("text_ops")),
	index("templateReview_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.templateId],
			foreignColumns: [webTemplate.id],
			name: "templateReview_templateId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "templateReview_userId_fkey"
		}).onDelete("cascade"),
	unique("unique_user_template_review").on(table.templateId, table.userId),
]);

export const creatorApplication = pgTable("creatorApplication", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	fullName: text().notNull(),
	email: text().notNull(),
	country: text().notNull(),
	state: text().notNull(),
	qualification: text().notNull(),
	resumeUrl: text().notNull(),
	profilePhotoUrl: text().notNull(),
	portfolioUrl: text(),
	bio: text(),
	specialization: text(),
	status: text().default('pending').notNull(),
	adminNotes: text(),
	submittedAt: timestamp({ mode: 'string' }).notNull(),
	reviewedAt: timestamp({ mode: 'string' }),
	reviewedBy: text(),
}, (table) => [
	index("idx_creator_app_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_creator_app_user").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "creatorApplication_userId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.reviewedBy],
			foreignColumns: [user.id],
			name: "creatorApplication_reviewedBy_fkey"
		}),
]);

export const project = pgTable("project", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "project_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	userId: text(),
	json: text().notNull(),
	height: integer().notNull(),
	width: integer().notNull(),
	thumbnailUrl: text(),
	isTemplate: boolean(),
	isPro: boolean(),
	createdAt: timestamp({ mode: 'string' }),
	updatedAt: timestamp({ mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "project_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const templateAsset = pgTable("templateAsset", {
	id: text().primaryKey().notNull(),
	templateId: text().notNull(),
	fileName: text().notNull(),
	fileUrl: text().notNull(),
	fileType: text().notNull(),
	fileSize: integer(),
	elementId: text(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("templateAsset_templateId_idx").using("btree", table.templateId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.templateId],
			foreignColumns: [htmlTemplate.id],
			name: "templateAsset_templateId_htmlTemplate_id_fk"
		}).onDelete("cascade"),
]);

export const templateCustomization = pgTable("templateCustomization", {
	id: text().primaryKey().notNull(),
	templateId: text().notNull(),
	userId: text().notNull(),
	customData: text().notNull(),
	customAssets: text(),
	slug: text(),
	isPublished: boolean().default(false),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("templateCustomization_templateId_idx").using("btree", table.templateId.asc().nullsLast().op("text_ops")),
	index("templateCustomization_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.templateId],
			foreignColumns: [htmlTemplate.id],
			name: "templateCustomization_templateId_htmlTemplate_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "templateCustomization_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("templateCustomization_slug_key").on(table.slug),
]);

export const htmlTemplate = pgTable("htmlTemplate", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	htmlCode: text().notNull(),
	cssCode: text(),
	jsCode: text(),
	creatorId: text().notNull(),
	category: text().notNull(),
	thumbnail: text(),
	price: integer().default(0),
	pricingByCountry: text(),
	status: text().default('draft'),
	isActive: boolean().default(false),
	isFree: boolean().default(false),
	editableFields: text(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
	categoryId: text(),
	subcategoryId: text(),
	slug: text(),
	isPublished: boolean().default(false),
	translations: text(),
}, (table) => [
	index("htmlTemplate_category_idx").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("htmlTemplate_creatorId_idx").using("btree", table.creatorId.asc().nullsLast().op("text_ops")),
	index("htmlTemplate_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.creatorId],
			foreignColumns: [user.id],
			name: "htmlTemplate_creatorId_user_id_fk"
		}).onDelete("cascade"),
	unique("htmlTemplate_slug_unique").on(table.slug),
]);

export const subscription = pgTable("subscription", {
	id: text().primaryKey().notNull(),
	userId: text(),
	subscriptionId: text(),
	customerId: text(),
	priceId: text(),
	status: text(),
	currentPeriodEnd: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }),
	updatedAt: timestamp({ mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "subscription_userId_user_id_fk"
		}).onDelete("cascade"),
]);
