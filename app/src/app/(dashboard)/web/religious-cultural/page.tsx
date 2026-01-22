"use client";

import { CategoryTemplatePage } from "@/features/web-projects/components/category-template-page";
import { categoryConfigs } from "@/features/web-projects/config/category-configs";

export default function ReligiousTemplatesPage() {
    return <CategoryTemplatePage config={categoryConfigs.religious} />;
}
