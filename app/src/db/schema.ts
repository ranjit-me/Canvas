
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  // removed $defaultFn so ORM will not send an id on insert
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  creatorStatus: text("creatorStatus").default("none"), // none, pending, approved, rejected
  templateLanguage: text("templateLanguage"), // user's preferred template language
  bio: text("bio"), // Creator bio/about
  portfolioUrl: text("portfolioUrl"), // Creator portfolio/website URL
  socialLinks: text("socialLinks"), // JSON: { twitter, linkedin, github, etc. }
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  userLeads: many(userLeads),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const projects = pgTable("project", {
  // removed $defaultFn so ORM will not send an id on insert
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  json: text("json").notNull(),
  height: integer("height").notNull(),
  width: integer("width").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  isTemplate: boolean("isTemplate"),
  isPro: boolean("isPro"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export const projectsInsertSchema = createInsertSchema(projects);

export const subscriptions = pgTable("subscription", {
  // removed $defaultFn so ORM will not send an id on insert
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  subscriptionId: text("subscriptionId").notNull(),
  customerId: text("customerId").notNull(),
  priceId: text("priceId").notNull(),
  status: text("status").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});
export const webProjects = pgTable("webProject", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  templateId: text("templateId").notNull(), // e.g. 'rose-birthday'
  slug: text("slug").unique(), // URL-friendly identifier for public access
  json: text("json").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  isPublished: boolean("isPublished").default(false),
  country: text("country"), // Origin of the project/order
  paymentStatus: text("paymentStatus").default("pending"),
  razorpayOrderId: text("razorpayOrderId"),
  razorpayPaymentId: text("razorpayPaymentId"),
  pricePaid: integer("pricePaid"),
  purchasedAt: timestamp("purchasedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const webProjectsRelations = relations(webProjects, ({ one }) => ({
  user: one(users, {
    fields: [webProjects.userId],
    references: [users.id],
  }),
}));

export const webProjectsInsertSchema = createInsertSchema(webProjects);

// Categories and Subcategories for template organization
export const categories = pgTable("category", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  displayOrder: integer("displayOrder").default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  webTemplates: many(webTemplates),
  htmlTemplates: many(htmlTemplates),
}));

export const categoriesInsertSchema = createInsertSchema(categories);

export const subcategories = pgTable("subcategory", {
  id: text("id").primaryKey(),
  categoryId: text("categoryId")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  displayOrder: integer("displayOrder").default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  webTemplates: many(webTemplates),
  htmlTemplates: many(htmlTemplates),
}));

export const subcategoriesInsertSchema = createInsertSchema(subcategories);

export const webTemplates = pgTable("webTemplate", {
  id: text("id").primaryKey(), // e.g. 'rose-birthday'
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // e.g. 'birthday-girlfriend' - DEPRECATED, use categoryId/subcategoryId
  categoryId: text("categoryId").references(() => categories.id),
  subcategoryId: text("subcategoryId").references(() => subcategories.id),
  thumbnail: text("thumbnail"),
  videoUrl: text("videoUrl"), // YouTube video URL for preview
  isFree: boolean("isFree").default(true),
  isPro: boolean("isPro").default(false),
  price: integer("price").default(0), // Default/fallback price in cents
  discount: integer("discount").default(0),
  pricingByCountry: text("pricingByCountry"), // JSON: { "IN": 299, "US": 499, ... }
  componentCode: text("componentCode"), // Original code uploaded by creator
  configSchema: text("configSchema"), // JSON: [{key, type, label}, ...]
  initialConfig: text("initialConfig"), // JSON: {key: value}
  translations: text("translations"), // JSON: { en: {...}, hi: {...}, es: {...}, ... }
  isDynamic: boolean("isDynamic").default(false), // True if uploaded via creator dashboard
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const webTemplatesRelations = relations(webTemplates, ({ one }) => ({
  category: one(categories, {
    fields: [webTemplates.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [webTemplates.subcategoryId],
    references: [subcategories.id],
  }),
}));

export const webTemplatesInsertSchema = createInsertSchema(webTemplates);

export const userLeads = pgTable("userLead", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  whatsapp: text("whatsapp"),
  country: text("country").notNull(),
  countryCode: text("countryCode"), // ISO country code (e.g., "IN", "US")
  state: text("state"),
  ipAddress: text("ipAddress"), // User's IP address for country detection
  interests: text("interests"), // JSON stringified array
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const userLeadsRelations = relations(userLeads, ({ one }) => ({
  user: one(users, {
    fields: [userLeads.userId],
    references: [users.id],
  }),
}));

export const userLeadsInsertSchema = createInsertSchema(userLeads);

export const siteSettings = pgTable("siteSettings", {
  id: text("id").primaryKey(),
  siteName: text("siteName").notNull().default("Giftora"),
  siteLogo: text("siteLogo"),
  contactEmail: text("contactEmail"),
  contactPhone: text("contactPhone"),
  contactAddress: text("contactAddress"),
  aboutUsContent: text("aboutUsContent"),
  socialLinks: text("socialLinks"), // JSON: { facebook, twitter, instagram, linkedin }
  defaultTemplateLanguage: text("defaultTemplateLanguage").default("en"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const siteSettingsInsertSchema = createInsertSchema(siteSettings);

export const promotionalBanners = pgTable("promotionalBanner", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  price: text("price"), // e.g., "From ₹2,999"
  imageUrl: text("imageUrl").notNull(),
  linkUrl: text("linkUrl").notNull(), // URL to redirect when banner is clicked
  backgroundColor: text("backgroundColor").default("#4F46E5"), // Default purple
  isActive: boolean("isActive").default(true),
  displayOrder: integer("displayOrder").default(0), // For ordering banners
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const promotionalBannersInsertSchema = createInsertSchema(promotionalBanners);

// Template Reviews Schema
export const templateReviews = pgTable("templateReview", {
  id: text("id").primaryKey(),
  templateId: text("templateId")
    .notNull()
    .references(() => webTemplates.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userName: text("userName").notNull(),
  userEmail: text("userEmail").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  reviewText: text("reviewText"), // Optional review text
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const templateReviewsRelations = relations(templateReviews, ({ one }) => ({
  template: one(webTemplates, {
    fields: [templateReviews.templateId],
    references: [webTemplates.id],
  }),
  user: one(users, {
    fields: [templateReviews.userId],
    references: [users.id],
  }),
}));

export const templateReviewsInsertSchema = createInsertSchema(templateReviews);

// HTML Templates Schema - For creator-uploaded HTML/CSS/JS templates
export const htmlTemplates = pgTable("htmlTemplate", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  htmlCode: text("htmlCode").notNull(),
  cssCode: text("cssCode"),
  jsCode: text("jsCode"),
  creatorId: text("creatorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // e.g., 'birthday', 'anniversary', 'wedding' - DEPRECATED
  categoryId: text("categoryId").references(() => categories.id),
  subcategoryId: text("subcategoryId").references(() => subcategories.id),
  thumbnail: text("thumbnail"),
  price: integer("price").default(0), // Price in cents
  pricingByCountry: text("pricingByCountry"), // JSON: geo-targeted pricing
  status: text("status").default("draft"), // draft, pending, approved, rejected
  isActive: boolean("isActive").default(false),
  isFree: boolean("isFree").default(false),
  editableFields: text("editableFields"), // JSON: [{id, type, label, defaultValue}]
  translations: text("translations"), // JSON: { en: {...}, hi: {...}, es: {...}, ... }
  slug: text("slug").unique(), // URL-friendly identifier for public access
  isPublished: boolean("isPublished").default(false), // Whether template is publicly accessible
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const htmlTemplatesRelations = relations(htmlTemplates, ({ one, many }) => ({
  creator: one(users, {
    fields: [htmlTemplates.creatorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [htmlTemplates.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [htmlTemplates.subcategoryId],
    references: [subcategories.id],
  }),
  assets: many(templateAssets),
  customizations: many(templateCustomizations),
}));

export const htmlTemplatesInsertSchema = createInsertSchema(htmlTemplates);

// Template Assets - For images and other files uploaded with templates
export const templateAssets = pgTable("templateAsset", {
  id: text("id").primaryKey(),
  templateId: text("templateId")
    .notNull()
    .references(() => htmlTemplates.id, { onDelete: "cascade" }),
  fileName: text("fileName").notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileType: text("fileType").notNull(), // 'image', 'font', 'video', etc.
  fileSize: integer("fileSize"), // in bytes
  elementId: text("elementId"), // CSS selector or ID of element using this asset
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
});

export const templateAssetsRelations = relations(templateAssets, ({ one }) => ({
  template: one(htmlTemplates, {
    fields: [templateAssets.templateId],
    references: [htmlTemplates.id],
  }),
}));

export const templateAssetsInsertSchema = createInsertSchema(templateAssets);

// Template Customizations - User-specific customizations of purchased templates
export const templateCustomizations = pgTable("templateCustomization", {
  id: text("id").primaryKey(),
  templateId: text("templateId")
    .notNull()
    .references(() => htmlTemplates.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  customData: text("customData").notNull(), // JSON: {fieldId: value}
  customAssets: text("customAssets"), // JSON: {elementId: newImageUrl}
  slug: text("slug").unique(), // For public URL
  isPublished: boolean("isPublished").default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const templateCustomizationsRelations = relations(templateCustomizations, ({ one }) => ({
  template: one(htmlTemplates, {
    fields: [templateCustomizations.templateId],
    references: [htmlTemplates.id],
  }),
  user: one(users, {
    fields: [templateCustomizations.userId],
    references: [users.id],
  }),
}));

export const templateCustomizationsInsertSchema = createInsertSchema(templateCustomizations);

// Creator Applications - For users applying to become creators
export const creatorApplications = pgTable("creatorApplication", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: text("fullName").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  country: text("country").notNull(),
  state: text("state").notNull(),
  qualification: text("qualification").notNull(),
  resumeUrl: text("resumeUrl").notNull(), // URL to uploaded resume
  profilePhotoUrl: text("profilePhotoUrl").notNull(), // URL to uploaded profile photo
  portfolioUrl: text("portfolioUrl"), // Optional portfolio/website URL
  bio: text("bio"), // About the creator
  specialization: text("specialization"), // e.g., "Birthday Cards", "Wedding Invitations"
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  adminNotes: text("adminNotes"), // Admin feedback/notes
  submittedAt: timestamp("submittedAt", { mode: "date" })
    .notNull()
    .defaultNow(),
  reviewedAt: timestamp("reviewedAt", { mode: "date" }),
  reviewedBy: text("reviewedBy").references(() => users.id), // Admin who reviewed
});

export const creatorApplicationsRelations = relations(creatorApplications, ({ one }) => ({
  user: one(users, {
    fields: [creatorApplications.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [creatorApplications.reviewedBy],
    references: [users.id],
  }),
}));

export const creatorApplicationsInsertSchema = createInsertSchema(creatorApplications);

