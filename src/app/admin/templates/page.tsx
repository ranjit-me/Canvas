"use client";

import { useEffect, useState } from "react";
import {
    Users,
    LayoutTemplate,
    CreditCard,
    BarChart3,
    RefreshCcw,
    LogOut,
    Loader2,
    Edit3,
    DollarSign,
    Search,
    ChevronRight,
    Trash2,
    Mail,
    Phone,
    CheckCircle2,
    Settings,
    Tags,
    Eye,
    X
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter as useNextRouter } from "next/navigation";

import { useGetWebTemplatesAdmin } from "@/features/web-projects/api/use-get-web-templates-admin";
import { useGetWebTemplateStats } from "@/features/web-projects/api/use-get-web-template-stats";
import { useUpdateWebTemplate } from "@/features/web-projects/api/use-update-web-template";
import { useSyncWebTemplates } from "@/features/web-projects/api/use-sync-web-templates";

import { TemplateDetailsModal } from "@/features/web-projects/components/template-details-modal";
import { useGetAllLeads } from "@/features/leads/api/use-get-all-leads";
import { useDeleteLead } from "@/features/leads/api/use-delete-lead";
import { useGetAllOrders } from "@/features/payments/api/use-get-all-orders";
import ImageUpload from "@/components/admin/ImageUpload";
import { SiteSettingsSection } from "@/components/admin/SiteSettingsSection";
import { useGetHtmlTemplates } from "@/features/html-templates/api/use-get-html-templates";
import { useUpdateHtmlTemplate } from "@/features/html-templates/api/use-update-html-template";
import { CategoryManagement } from "@/features/categories/components/category-management";
import { CreatorManagement } from "@/features/creators/components/CreatorManagement";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { AdminTemplateCard } from "@/components/admin/AdminTemplateCard";
import { useDeleteWebTemplate } from "@/features/web-projects/api/use-delete-web-template";
import { useDeleteHtmlTemplate } from "@/features/html-templates/api/use-delete-html-template";

const SIDEBAR_ITEMS = [
    { id: "templates", label: "Template Management", icon: LayoutTemplate },
    { id: "categories", label: "Category Management", icon: Tags },
    { id: "creators", label: "Creator Management", icon: Users },
];

export default function AdminDashboardPage() {
    const router = useNextRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"edit" | "pricing" | "reviews">("edit");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [sortOption, setSortOption] = useState("newest");
    const [activeSection, setActiveSection] = useState("templates");
    const [leadToDelete, setLeadToDelete] = useState<any>(null);
    const [selectedHtmlTemplate, setSelectedHtmlTemplate] = useState<any>(null);
    const [previewTemplate, setPreviewTemplate] = useState<any>(null);

    const { data: templates, isLoading: templatesLoading } = useGetWebTemplatesAdmin();
    const { data: stats, isLoading: statsLoading } = useGetWebTemplateStats();
    const { data: leads, isLoading: leadsLoading } = useGetAllLeads();
    const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
    const { data: pendingHtmlTemplates } = useGetHtmlTemplates({ status: "pending" });
    const { data: approvedHtmlTemplates } = useGetHtmlTemplates({ status: "approved" });
    const updateMutation = useUpdateWebTemplate();
    const updateHtmlMutation = useUpdateHtmlTemplate();
    const deleteWebMutation = useDeleteWebTemplate();
    const deleteHtmlMutation = useDeleteHtmlTemplate();
    const syncMutation = useSyncWebTemplates();
    const deleteLead = useDeleteLead();

    const [countryFilter, setCountryFilter] = useState("all");

    const { data: categoriesData } = useGetCategories();

    // Main Categories Options
    const categoryOptions = [
        { id: "all", label: "All Categories" },
        ...(categoriesData?.map((cat: any) => ({
            id: cat.id,
            label: cat.name,
            original: cat
        })) || [])
    ];

    // Subcategories Options (dependent on selectedCategory)
    const selectedCategoryData = categoriesData?.find((c: any) => c.id === selectedCategory);
    const subcategoryOptions = [
        { id: "all", label: "All Subcategories" },
        ...(selectedCategoryData?.subcategories?.map((sub: any) => ({
            id: sub.id,
            label: sub.name
        })) || [])
    ];

    useEffect(() => {
        // Reset subcategory when category changes
        setSelectedSubcategory("all");
    }, [selectedCategory]);

    useEffect(() => {
        const auth = localStorage.getItem("admin_auth");
        if (auth === "authorized") {
            setIsAuthorized(true);
        } else {
            router.push("/admin/login");
        }
    }, [router]);


    // Combine React and HTML templates
    // Combine React and HTML templates
    // API already returns merged list
    const allTemplates = templates || [];

    const finalDisplayTemplates = allTemplates.filter((template: any) => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Category Filter
        let matchesCategory = true;
        if (selectedCategory !== "all") {
            // Check categoryId OR legacy category string matching the selected category name or ID
            const selectedCatLabel = categoryOptions.find(c => c.id === selectedCategory)?.label?.toLowerCase();
            const selectedCatId = selectedCategory.toLowerCase();

            matchesCategory =
                template.categoryId === selectedCategory ||
                (template.category && (
                    template.category.toLowerCase() === selectedCatId ||
                    (selectedCatLabel && template.category.toLowerCase().includes(selectedCatLabel)) ||
                    template.category.toLowerCase().includes(selectedCatId)
                ));
        }

        // Subcategory Filter
        let matchesSubcategory = true;
        if (selectedSubcategory !== "all") {
            matchesSubcategory = template.subcategoryId === selectedSubcategory;
            // Note: Legacy data might not have subcategoryId. 
            // If needed, we could check matching hierarchy in legacy string, but assuming new structure for subcat filtering.
        }

        return matchesSearch && matchesCategory && matchesSubcategory;
    }).sort((a: any, b: any) => {
        switch (sortOption) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "category":
                return a.category.localeCompare(b.category);
            case "top-selling":
                const ordersA = stats?.templateUsage?.find((t: any) => t.id === a.id)?.count || 0;
                const ordersB = stats?.templateUsage?.find((t: any) => t.id === b.id)?.count || 0;
                return ordersB - ordersA;
            case "less-selling":
                const ordersALess = stats?.templateUsage?.find((t: any) => t.id === a.id)?.count || 0;
                const ordersBLess = stats?.templateUsage?.find((t: any) => t.id === b.id)?.count || 0;
                return ordersALess - ordersBLess;
            default:
                return 0;
        }
    });

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Sub-navigation */}
            <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <nav className="flex gap-8 h-full">
                        {SIDEBAR_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={cn(
                                        "flex items-center gap-2 h-full px-1 border-b-2 transition-all font-medium text-sm",
                                        isActive
                                            ? "border-gray-900 text-gray-900"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => syncMutation.mutate()}
                            disabled={syncMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {syncMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="w-4 h-4" />
                            )}
                            Sync Templates
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-auto">
                {activeSection === "templates" && (
                    <div className="space-y-6">
                        {/* Pending HTML Templates Alert */}
                        {pendingHtmlTemplates?.templates && pendingHtmlTemplates.templates.length > 0 && (
                            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-3 w-3 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Pending HTML Templates</h3>
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-sm font-bold rounded-full">
                                        {pendingHtmlTemplates.templates.length} awaiting review
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pendingHtmlTemplates.templates.map((template: any) => (
                                        <div key={template.id} className="bg-white rounded-lg border-2 border-yellow-400 p-4">
                                            <div className="aspect-video bg-gray-100 rounded mb-3 overflow-hidden">
                                                {template.thumbnail && (
                                                    <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <h4 className="font-bold text-gray-900">{template.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{template.description}</p>
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={async () => {
                                                        await updateHtmlMutation.mutateAsync({
                                                            id: template.id,
                                                            status: 'approved',
                                                            isActive: true
                                                        });
                                                    }}
                                                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                                >
                                                    ✓ Approve
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        await updateHtmlMutation.mutateAsync({
                                                            id: template.id,
                                                            status: 'rejected'
                                                        });
                                                    }}
                                                    className="flex-1 px-3 py-2 border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium"
                                                >
                                                    ✕ Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Search and Filters Bar */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-2 flex items-center gap-2 w-full">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border-none bg-transparent focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500 font-medium"
                                />
                            </div>

                            <div className="h-8 w-px bg-gray-200 mx-2" />

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 bg-transparent border-none text-gray-700 font-medium focus:outline-none focus:ring-0 cursor-pointer hover:bg-gray-50 rounded-lg max-w-[200px]"
                            >
                                {categoryOptions.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>

                            <div className="h-8 w-px bg-gray-200 mx-2" />
                            <select
                                value={selectedSubcategory}
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                                disabled={subcategoryOptions.length <= 1}
                                className={cn(
                                    "px-4 py-2 bg-transparent border-none text-gray-700 font-medium focus:outline-none focus:ring-0 rounded-lg max-w-[200px]",
                                    subcategoryOptions.length <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
                                )}
                            >
                                {subcategoryOptions.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.label}
                                    </option>
                                ))}
                            </select>

                            <div className="h-8 w-px bg-gray-200 mx-2" />

                            <div className="relative">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-2 bg-transparent border-none text-gray-900 font-medium focus:outline-none focus:ring-0 cursor-pointer hover:bg-gray-50 rounded-lg text-right"
                                >
                                    <option value="newest">Sort by date (Newest)</option>
                                    <option value="oldest">Sort by date (Oldest)</option>
                                    <option value="category">Sort by category</option>
                                    <option value="top-selling">Sort by top selling</option>
                                    <option value="less-selling">sort by less selling</option>
                                    <option value="name-asc">Sort by name (A-Z)</option>
                                    <option value="name-desc">Sort by name (Z-A)</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 font-medium">Filter</span>
                            </div>
                        </div>

                        {/* Results Stat */}
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500">
                                Showing <span className="font-bold text-gray-900">{finalDisplayTemplates.length}</span> templates
                            </p>
                        </div>

                        {/* Templates Grid */}
                        {templatesLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {finalDisplayTemplates?.map((template: any, index: number) => (
                                    <AdminTemplateCard
                                        key={`${template.id}-${index}`}
                                        template={template}
                                        onPreview={(t) => setPreviewTemplate(t)}
                                        onEdit={(t) => {
                                            if (t.isHtmlTemplate) {
                                                setSelectedHtmlTemplate(t);
                                                setActiveTab("edit");
                                            } else {
                                                setSelectedTemplate(t);
                                                setActiveTab("edit");
                                            }
                                        }}
                                        onPricing={(t) => {
                                            if (t.isHtmlTemplate) {
                                                setSelectedHtmlTemplate(t);
                                                setActiveTab("pricing");
                                            } else {
                                                setSelectedTemplate(t);
                                                setActiveTab("pricing");
                                            }
                                        }}
                                        onReviews={(t) => {
                                            if (t.isHtmlTemplate) {
                                                setSelectedHtmlTemplate(t);
                                                setActiveTab("reviews");
                                            } else {
                                                setSelectedTemplate(t);
                                                setActiveTab("reviews");
                                            }
                                        }}
                                        onDelete={(t) => {
                                            if (confirm("Are you sure you want to delete this template?")) {
                                                if (t.isHtmlTemplate) {
                                                    deleteHtmlMutation.mutate({ id: t.id });
                                                } else {
                                                    deleteWebMutation.mutate({ id: t.id });
                                                }
                                            }
                                        }}
                                        onToggleStatus={(t) => {
                                            if (t.isHtmlTemplate) {
                                                updateHtmlMutation.mutate({
                                                    id: t.id,
                                                    isActive: !t.isActive
                                                });
                                            } else {
                                                updateMutation.mutate({
                                                    id: t.id,
                                                    isActive: !t.isActive
                                                });
                                            }
                                        }}
                                        onToggleFree={(t) => {
                                            if (t.isHtmlTemplate) {
                                                updateHtmlMutation.mutate({
                                                    id: t.id,
                                                    isFree: !t.isFree
                                                });
                                            } else {
                                                updateMutation.mutate({
                                                    id: t.id,
                                                    isFree: !t.isFree
                                                });
                                            }
                                        }}
                                        onEditCode={(t) => {
                                            if (t.isHtmlTemplate) {
                                                router.push(`/creator/html?id=${t.id}`);
                                            } else {
                                                // Handle non-HTML templates if needed, or just toast
                                                // For now, only HTML templates have the editor
                                                // but button is shown for all.
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "categories" && (
                    <CategoryManagement />
                )}
            </main>

            {/* Template Details Modal - React Templates */}
            {selectedTemplate && (
                <TemplateDetailsModal
                    isOpen={!!selectedTemplate}
                    onClose={() => setSelectedTemplate(null)}
                    template={selectedTemplate}
                    initialTab={activeTab}
                />
            )}

            {/* Template Details Modal - HTML Templates */}
            {selectedHtmlTemplate && (
                <TemplateDetailsModal
                    isOpen={!!selectedHtmlTemplate}
                    onClose={() => setSelectedHtmlTemplate(null)}
                    template={selectedHtmlTemplate}
                    initialTab={activeTab}
                />
            )}

            {/* Delete Confirmation Modal */}
            {leadToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Delete Lead
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Are you sure you want to delete <span className="font-bold text-gray-900">{leadToDelete.name}</span>?
                                    This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            deleteLead.mutate(leadToDelete.id);
                                            setLeadToDelete(null);
                                        }}
                                        disabled={deleteLead.isPending}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                                    >
                                        {deleteLead.isPending ? "Deleting..." : "Yes, Delete"}
                                    </button>
                                    <button
                                        onClick={() => setLeadToDelete(null)}
                                        disabled={deleteLead.isPending}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Template Preview Modal */}
            {previewTemplate && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] shadow-2xl flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{previewTemplate.name}</h3>
                                <p className="text-sm text-gray-500">Template Preview</p>
                            </div>
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body - iframe */}
                        <div className="flex-1 overflow-hidden">
                            <iframe
                                src={
                                    previewTemplate.isHtmlTemplate
                                        ? `/html-preview/${previewTemplate.id}`
                                        : `/preview/${previewTemplate.id}`
                                }
                                className="w-full h-full border-0"
                                title="Template Preview"
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
