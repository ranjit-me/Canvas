"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTemplateReviews } from "@/features/reviews/api/use-get-template-reviews";
import { useUpdateWebTemplate } from "@/features/web-projects/api/use-update-web-template";
import { useUpdateHtmlTemplate } from "@/features/html-templates/api/use-update-html-template";
import { useDeleteReview } from "@/features/reviews/api/use-delete-review";
import { formatPrice, PRICING_COUNTRIES, DEFAULT_PRICING_BY_COUNTRY, type CountryCode } from "@/lib/pricing";
import { Loader2, Trash2, Star, DollarSign, Edit3, MessageSquare } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

interface TemplateDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: any;
    initialTab?: "edit" | "pricing" | "reviews";
}

export const TemplateDetailsModal = ({
    isOpen,
    onClose,
    template,
    initialTab = "edit",
}: TemplateDetailsModalProps) => {
    const [editingTemplate, setEditingTemplate] = useState<any>(template);
    const [pricing, setPricing] = useState<Record<string, number>>(() => {
        if (template.pricingByCountry) {
            try {
                return JSON.parse(template.pricingByCountry);
            } catch {
                return { ...DEFAULT_PRICING_BY_COUNTRY };
            }
        }
        return { ...DEFAULT_PRICING_BY_COUNTRY };
    });

    // Detect if this is an HTML template
    const isHtmlTemplate = template.isHtmlTemplate || template.htmlContent;

    const updateWebMutation = useUpdateWebTemplate();
    const updateHtmlMutation = useUpdateHtmlTemplate();
    const deleteReview = useDeleteReview();
    const { data: reviewsData, isLoading: reviewsLoading } = useGetTemplateReviews(template.id);
    const { data: categories } = useGetCategories();

    // Get filtered subcategories based on selected category
    const selectedCategoryId = editingTemplate.categoryId || "";
    const selectedCategory = categories?.find((cat: any) => cat.id === selectedCategoryId);
    const availableSubcategories = selectedCategory?.subcategories || [];

    const handleUpdate = async () => {
        try {
            if (isHtmlTemplate) {
                // Use HTML template mutation - only send fields that exist in schema
                const htmlUpdateData: any = {};

                if (editingTemplate.name !== undefined) htmlUpdateData.name = editingTemplate.name;
                if (editingTemplate.description !== undefined) htmlUpdateData.description = editingTemplate.description;
                if (editingTemplate.category !== undefined) htmlUpdateData.category = editingTemplate.category;
                if (editingTemplate.categoryId !== undefined) htmlUpdateData.categoryId = editingTemplate.categoryId;
                if (editingTemplate.subcategoryId !== undefined) htmlUpdateData.subcategoryId = editingTemplate.subcategoryId;
                if (editingTemplate.thumbnail !== undefined) htmlUpdateData.thumbnail = editingTemplate.thumbnail;
                if (editingTemplate.isFree !== undefined) htmlUpdateData.isFree = editingTemplate.isFree;
                if (editingTemplate.isActive !== undefined) htmlUpdateData.isActive = editingTemplate.isActive;

                // Set price from India pricing
                if (pricing.IN !== undefined) {
                    htmlUpdateData.price = pricing.IN;
                }

                // Save complete pricing configuration
                htmlUpdateData.pricingByCountry = JSON.stringify(pricing);

                await updateHtmlMutation.mutateAsync({
                    id: template.id,
                    ...htmlUpdateData
                });
            } else {
                // Use React template mutation
                await updateWebMutation.mutateAsync({
                    id: template.id,
                    ...editingTemplate,
                    pricingByCountry: JSON.stringify(pricing),
                });
            }
            toast.success("Template updated successfully");
            onClose();
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update template");
        }
    };

    const handlePriceChange = (countryCode: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setPricing(prev => ({ ...prev, [countryCode]: numValue }));
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            await deleteReview.mutateAsync({ param: { reviewId } });
            toast.success("Review deleted");
        } catch {
            toast.error("Failed to delete review");
        }
    };

    const getFlag = (code: string) => {
        const flags: Record<string, string> = {
            IN: "🇮🇳", ES: "🇪🇸", FR: "🇫🇷", SA: "🇸🇦", CN: "🇨🇳",
            PT: "🇵🇹", BD: "🇧🇩", RU: "🇷🇺", PK: "🇵🇰", ID: "🇮🇩",
            DE: "🇩🇪", US: "🇺🇸", GB: "🇬🇧", OTHER: "🌐"
        };
        return flags[code] || "🏳️";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1200px] h-[80vh] flex flex-col p-0 overflow-hidden bg-gray-50/50">
                <div className="flex h-full">
                    {/* Left Column - Preview */}
                    <div className="w-[400px] bg-white border-r border-gray-200 p-6 flex flex-col overflow-y-auto">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6 shadow-sm border border-gray-100">
                            {template.thumbnail ? (
                                <img
                                    src={template.thumbnail}
                                    alt={template.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h2>
                        <p className="text-sm text-gray-500 mb-4">{template.category}</p>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Total Sales</div>
                                <div className="text-2xl font-bold text-blue-900">N/A</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Average Rating</div>
                                <div className="flex items-center gap-1">
                                    <span className="text-2xl font-bold text-purple-900">{reviewsData?.averageRating || 0}</span>
                                    <Star className="size-5 text-yellow-400 fill-yellow-400" />
                                </div>
                                <div className="text-xs text-purple-600 mt-1">{reviewsData?.totalReviews || 0} reviews</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Tabs */}
                    <div className="flex-1 bg-white p-6 flex flex-col overflow-hidden">
                        <Tabs defaultValue={initialTab} className="h-full flex flex-col">
                            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-xl">
                                <TabsTrigger value="edit" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Details
                                </TabsTrigger>
                                <TabsTrigger value="pricing" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Pricing
                                </TabsTrigger>
                                <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Reviews
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex-1 overflow-y-auto pr-2">
                                {/* Edit Tab */}
                                <TabsContent value="edit" className="space-y-4 mt-0">
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Name</Label>
                                            <Input
                                                value={editingTemplate.name}
                                                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <textarea
                                                value={editingTemplate.description || ''}
                                                onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                                                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Category</Label>
                                                <select
                                                    value={editingTemplate.categoryId || ''}
                                                    onChange={(e) => {
                                                        setEditingTemplate({
                                                            ...editingTemplate,
                                                            categoryId: e.target.value,
                                                            subcategoryId: '' // Reset subcategory when category changes
                                                        });
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories?.map((cat: any) => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <Label>Subcategory</Label>
                                                <select
                                                    value={editingTemplate.subcategoryId || ''}
                                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subcategoryId: e.target.value })}
                                                    disabled={!editingTemplate.categoryId}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                >
                                                    <option value="">Select Subcategory</option>
                                                    {availableSubcategories.map((subcat: any) => (
                                                        <option key={subcat.id} value={subcat.id}>
                                                            {subcat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>YouTube URL</Label>
                                            <Input
                                                value={editingTemplate.videoUrl || ''}
                                                onChange={(e) => setEditingTemplate({ ...editingTemplate, videoUrl: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block">Thumbnail</Label>
                                            <ImageUpload
                                                value={editingTemplate.thumbnail || ''}
                                                onChange={(url: string) => setEditingTemplate({ ...editingTemplate, thumbnail: url })}
                                                disabled={updateWebMutation.isPending || updateHtmlMutation.isPending}
                                            />
                                        </div>
                                        <div className="flex items-center gap-6 pt-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={editingTemplate.isFree}
                                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, isFree: e.target.checked })}
                                                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Free Template</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={editingTemplate.isActive}
                                                    onChange={(e) => setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })}
                                                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Active</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <Button onClick={handleUpdate} disabled={updateWebMutation.isPending || updateHtmlMutation.isPending} className="w-full">
                                            {(updateWebMutation.isPending || updateHtmlMutation.isPending) ? "Saving Changes..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Pricing Tab */}
                                <TabsContent value="pricing" className="space-y-6 mt-0">
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(PRICING_COUNTRIES).map(([code, info]) => (
                                            <div key={code} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl">{getFlag(code)}</div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-gray-900">{info.name}</div>
                                                        <div className="text-xs text-gray-500">{info.currency}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-200 group-hover:border-blue-200">
                                                    <span className="text-gray-400 font-medium">{info.symbol}</span>
                                                    <input
                                                        type="number"
                                                        value={pricing[code] || 0}
                                                        onChange={(e) => handlePriceChange(code, e.target.value)}
                                                        className="w-20 text-right font-medium outline-none bg-transparent"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4">
                                        <Button onClick={handleUpdate} disabled={updateWebMutation.isPending || updateHtmlMutation.isPending} className="w-full">
                                            {(updateWebMutation.isPending || updateHtmlMutation.isPending) ? "Updating Pricing..." : "Update Pricing"}
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Reviews Tab */}
                                <TabsContent value="reviews" className="space-y-4 mt-0">
                                    {reviewsLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                        </div>
                                    ) : reviewsData?.reviews?.length ? (
                                        <div className="space-y-4">
                                            {reviewsData.reviews.map((review: any) => (
                                                <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                                {review.userName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-sm text-gray-900">{review.userName}</div>
                                                                <div className="flex items-center gap-0.5">
                                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`size-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteReview(review.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                            disabled={deleteReview.isPending}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-gray-600 pl-10">{review.reviewText}</p>
                                                    <div className="text-xs text-gray-400 pl-10 mt-2">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <MessageSquare className="size-12 text-gray-200 mb-4" />
                                            <p className="text-gray-500 font-medium">No reviews yet</p>
                                            <p className="text-sm text-gray-400">Reviews from users will appear here</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
