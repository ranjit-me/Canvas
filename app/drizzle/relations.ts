import { relations } from "drizzle-orm/relations";
import { category, subcategory, user, account, webProject, session, authenticator, webTemplate, templateReview, creatorApplication, project, htmlTemplate, templateAsset, templateCustomization, subscription } from "./schema";

export const subcategoryRelations = relations(subcategory, ({one}) => ({
	category: one(category, {
		fields: [subcategory.categoryId],
		references: [category.id]
	}),
}));

export const categoryRelations = relations(category, ({many}) => ({
	subcategories: many(subcategory),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	webProjects: many(webProject),
	sessions: many(session),
	authenticators: many(authenticator),
	templateReviews: many(templateReview),
	creatorApplications_userId: many(creatorApplication, {
		relationName: "creatorApplication_userId_user_id"
	}),
	creatorApplications_reviewedBy: many(creatorApplication, {
		relationName: "creatorApplication_reviewedBy_user_id"
	}),
	projects: many(project),
	templateCustomizations: many(templateCustomization),
	htmlTemplates: many(htmlTemplate),
	subscriptions: many(subscription),
}));

export const webProjectRelations = relations(webProject, ({one}) => ({
	user: one(user, {
		fields: [webProject.userId],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(user, {
		fields: [authenticator.userId],
		references: [user.id]
	}),
}));

export const templateReviewRelations = relations(templateReview, ({one}) => ({
	webTemplate: one(webTemplate, {
		fields: [templateReview.templateId],
		references: [webTemplate.id]
	}),
	user: one(user, {
		fields: [templateReview.userId],
		references: [user.id]
	}),
}));

export const webTemplateRelations = relations(webTemplate, ({many}) => ({
	templateReviews: many(templateReview),
}));

export const creatorApplicationRelations = relations(creatorApplication, ({one}) => ({
	user_userId: one(user, {
		fields: [creatorApplication.userId],
		references: [user.id],
		relationName: "creatorApplication_userId_user_id"
	}),
	user_reviewedBy: one(user, {
		fields: [creatorApplication.reviewedBy],
		references: [user.id],
		relationName: "creatorApplication_reviewedBy_user_id"
	}),
}));

export const projectRelations = relations(project, ({one}) => ({
	user: one(user, {
		fields: [project.userId],
		references: [user.id]
	}),
}));

export const templateAssetRelations = relations(templateAsset, ({one}) => ({
	htmlTemplate: one(htmlTemplate, {
		fields: [templateAsset.templateId],
		references: [htmlTemplate.id]
	}),
}));

export const htmlTemplateRelations = relations(htmlTemplate, ({one, many}) => ({
	templateAssets: many(templateAsset),
	templateCustomizations: many(templateCustomization),
	user: one(user, {
		fields: [htmlTemplate.creatorId],
		references: [user.id]
	}),
}));

export const templateCustomizationRelations = relations(templateCustomization, ({one}) => ({
	htmlTemplate: one(htmlTemplate, {
		fields: [templateCustomization.templateId],
		references: [htmlTemplate.id]
	}),
	user: one(user, {
		fields: [templateCustomization.userId],
		references: [user.id]
	}),
}));

export const subscriptionRelations = relations(subscription, ({one}) => ({
	user: one(user, {
		fields: [subscription.userId],
		references: [user.id]
	}),
}));