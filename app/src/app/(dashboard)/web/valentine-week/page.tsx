"use client";

import { CategoryTemplatePage } from "@/features/web-projects/components/category-template-page";
import { categoryConfigs } from "@/features/web-projects/config/category-configs";

export default function ValentineWeekTemplatesPage() {
    return <CategoryTemplatePage config={categoryConfigs.valentine} />;
}
