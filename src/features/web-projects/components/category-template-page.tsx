"use client";

import { useState } from "react";
import Link from "next/link";
import {
    PartyPopper,
    CalendarHeart,
    Sparkles,
    Heart,
    Crown,
    Globe,
    ArrowRight,
    Search,
    X,
    LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGetWebTemplates } from "@/features/web-projects/api/use-get-web-templates";
import { WebTemplateCard } from "@/features/web-projects/components/web-template-card";

interface Subcategory {
    id: string;
    label: string;
    category: string;
    icon: LucideIcon;
}

interface CategoryConfig {
    title: string;
    description: string;
    icon: LucideIcon;
    gradient: string;
    bgGradient: string;
    categoryPrefix: string;
    subcategories: Subcategory[];
    activeColor: string;
}

interface CategoryTemplatePageProps {
    config: CategoryConfig;
}

export function CategoryTemplatePage({ config }: CategoryTemplatePageProps) {
    const { data: templatesRaw, isLoading } = useGetWebTemplates();
    const templates = (templatesRaw || []) as any[];
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter templates by category
    const categoryTemplates = templates.filter((t: any) => {
        const isCategory = t.category.startsWith(config.categoryPrefix);
        if (!isCategory) return false;

        // Filter by subcategory
        if (selectedSubcategory !== "all") {
            const subcat = config.subcategories.find(s => s.id === selectedSubcategory);
            if (subcat && !t.category.startsWith(subcat.category)) return false;
        }

        // Filter by search query
        if (searchQuery) {
            const matchesName = t.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = t.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesName || matchesCategory;
        }

        return true;
    }) || [];

    // Group templates by subcategory for "All" view
    const groupedTemplates = selectedSubcategory === "all"
        ? config.subcategories.slice(1).map(subcat => ({
            ...subcat,
            templates: templates.filter((t: any) => t.category.startsWith(subcat.category)) || []
        })).filter(group => group.templates.length > 0)
        : null;

    const MainIcon = config.icon;

    return (
        <div className={cn("min-h-screen", config.bgGradient)}>
            {/* Header */}
            <div className="relative pt-20 pb-12 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-96 h-96 opacity-30 rounded-full blur-3xl" style={{ background: config.gradient }} />
                    <div className="absolute bottom-0 left-0 w-80 h-80 opacity-20 rounded-full blur-3xl" style={{ background: config.gradient }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: config.gradient }}>
                                <MainIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                    {config.title}
                                </h1>
                                <p className="text-gray-600 mt-1 font-medium">
                                    {categoryTemplates.length} {config.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
                <div className="flex flex-col gap-4">
                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 transition-all",
                                `focus:border-${config.activeColor}-400 focus:ring-${config.activeColor}-100`
                            )}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Subcategory Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {config.subcategories.map((subcat) => {
                            const Icon = subcat.icon;
                            return (
                                <button
                                    key={subcat.id}
                                    onClick={() => setSelectedSubcategory(subcat.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap shrink-0",
                                        selectedSubcategory === subcat.id
                                            ? `text-white shadow-lg`
                                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                    )}
                                    style={selectedSubcategory === subcat.id ? { background: config.gradient } : {}}
                                >
                                    <Icon className="w-4 h-4" />
                                    {subcat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Templates Display */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: config.gradient }} />
                        <p className="text-gray-500 font-medium">Loading templates...</p>
                    </div>
                ) : selectedSubcategory === "all" && groupedTemplates ? (
                    // Grouped View
                    <div className="space-y-12">
                        {groupedTemplates.map((group) => {
                            const Icon = group.icon;
                            return (
                                <div key={group.id}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: config.gradient }}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">{group.label}</h2>
                                        <span className={cn("px-2.5 py-1 rounded-full text-sm font-semibold", `bg-${config.activeColor}-100 text-${config.activeColor}-700`)}>
                                            {group.templates.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {group.templates.map((template: any, idx: number) => (
                                            <WebTemplateCard key={template.id} template={template} index={idx} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : categoryTemplates.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 font-medium">No templates found</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedSubcategory("all"); }}
                            className="mt-4 px-6 py-2 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                            style={{ background: config.gradient }}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    // Filtered View
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryTemplates.map((template: any, index: number) => (
                            <WebTemplateCard key={template.id} template={template} index={index} />
                        ))}
                    </div>
                )}
            </div>

            {/* Category Navigation */}
            <section className="pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Explore Other Categories</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                            { title: "Birthday", icon: PartyPopper, href: "/web/birthday", color: "pink" },
                            { title: "Anniversary", icon: CalendarHeart, href: "/web/anniversary", color: "rose" },
                            { title: "Wedding", icon: Sparkles, href: "/web/wedding", color: "purple" },
                            { title: "Valentine", icon: Heart, href: "/web/valentine-week", color: "red" },
                            { title: "Special", icon: Crown, href: "/web/special-days", color: "indigo" },
                            { title: "Religious", icon: Globe, href: "/web/religious-cultural", color: "orange" },
                        ].map((item) => {
                            const isActive = item.title.toLowerCase() === config.title.split(" ")[0].toLowerCase();
                            return (
                                <Link key={item.title} href={item.href}>
                                    <div className={cn(
                                        "flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 border",
                                        isActive
                                            ? `bg-${config.activeColor}-50 border-${config.activeColor}-200 text-${config.activeColor}-700`
                                            : "bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50"
                                    )}>
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-semibold text-sm">{item.title}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
