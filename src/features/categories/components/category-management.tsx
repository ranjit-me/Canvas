"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    ChevronRight,
    ChevronDown,
    Plus,
    Edit,
    Trash2,
    FolderPlus,
} from "lucide-react";
import {
    useGetCategories,
    useDeleteCategory,
    useDeleteSubcategory,
} from "../hooks/use-categories";
import { CategoryFormDialog } from "./category-form-dialog";
import { SubcategoryFormDialog } from "./subcategory-form-dialog";

type Category = {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    displayOrder: number | null;
    subcategories?: Subcategory[];
};

type Subcategory = {
    id: string;
    categoryId: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    displayOrder: number | null;
};

export function CategoryManagement() {
    const { data: categories, isLoading } = useGetCategories();
    const deleteCategory = useDeleteCategory();
    const deleteSubcategory = useDeleteSubcategory();

    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set()
    );
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingSubcategory, setEditingSubcategory] =
        useState<Subcategory | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [deleteDialog, setDeleteDialog] = useState<{
        type: "category" | "subcategory";
        id: string;
        name: string;
    } | null>(null);

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const handleCreateCategory = () => {
        setEditingCategory(null);
        setIsCategoryDialogOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsCategoryDialogOpen(true);
    };

    const handleCreateSubcategory = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        setEditingSubcategory(null);
        setIsSubcategoryDialogOpen(true);
    };

    const handleEditSubcategory = (subcategory: Subcategory) => {
        setEditingSubcategory(subcategory);
        setSelectedCategoryId(subcategory.categoryId);
        setIsSubcategoryDialogOpen(true);
    };

    const handleDeleteClick = (
        type: "category" | "subcategory",
        id: string,
        name: string
    ) => {
        setDeleteDialog({ type, id, name });
    };

    const handleConfirmDelete = async () => {
        if (!deleteDialog) return;

        if (deleteDialog.type === "category") {
            await deleteCategory.mutateAsync(deleteDialog.id);
        } else {
            await deleteSubcategory.mutateAsync(deleteDialog.id);
        }

        setDeleteDialog(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p>Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Category Management</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage template categories and subcategories
                    </p>
                </div>
                <Button onClick={handleCreateCategory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="space-y-4">
                {categories?.map((category) => (
                    <Card key={category.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <Collapsible
                                    open={expandedCategories.has(category.id)}
                                    onOpenChange={() => toggleCategory(category.id)}
                                    className="flex-1"
                                >
                                    <CollapsibleTrigger className="flex items-center gap-2 hover:underline">
                                        {expandedCategories.has(category.id) ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                        <span className="text-lg font-semibold">
                                            {category.icon && (
                                                <span className="mr-2">{category.icon}</span>
                                            )}
                                            {category.name}
                                        </span>
                                        {category.subcategories && (
                                            <span className="text-sm text-muted-foreground">
                                                ({category.subcategories.length} subcategories)
                                            </span>
                                        )}
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="pt-4">
                                        <div className="space-y-2 pl-6">
                                            {category.subcategories?.length === 0 ? (
                                                <p className="text-sm text-muted-foreground italic">
                                                    No subcategories yet
                                                </p>
                                            ) : (
                                                category.subcategories?.map((subcategory) => (
                                                    <div
                                                        key={subcategory.id}
                                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                                                    >
                                                        <span className="text-sm">
                                                            {subcategory.icon && (
                                                                <span className="mr-2">{subcategory.icon}</span>
                                                            )}
                                                            {subcategory.name}
                                                        </span>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    handleEditSubcategory(subcategory)
                                                                }
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        "subcategory",
                                                                        subcategory.id,
                                                                        subcategory.name
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleCreateSubcategory(category.id)}
                                                className="mt-2"
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                Add Subcategory
                                            </Button>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>

                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEditCategory(category)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                            handleDeleteClick("category", category.id, category.name)
                                        }
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}

                {categories?.length === 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">
                                No categories yet. Create your first category to get started.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <CategoryFormDialog
                isOpen={isCategoryDialogOpen}
                onClose={() => {
                    setIsCategoryDialogOpen(false);
                    setEditingCategory(null);
                }}
                category={editingCategory || undefined}
            />

            <SubcategoryFormDialog
                isOpen={isSubcategoryDialogOpen}
                onClose={() => {
                    setIsSubcategoryDialogOpen(false);
                    setEditingSubcategory(null);
                }}
                categoryId={selectedCategoryId}
                subcategory={editingSubcategory || undefined}
            />

            <AlertDialog
                open={!!deleteDialog}
                onOpenChange={() => setDeleteDialog(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteDialog?.type === "category"
                                ? "This will delete the category and all its subcategories. This action cannot be undone."
                                : `This will delete the subcategory "${deleteDialog?.name}". This action cannot be undone.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
