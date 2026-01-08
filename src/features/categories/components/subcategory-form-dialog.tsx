"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateSubcategory, useUpdateSubcategory } from "../hooks/use-categories";

const subcategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    icon: z.string().optional(),
    displayOrder: z.coerce.number().optional(),
});

type SubcategoryFormValues = z.infer<typeof subcategorySchema>;

interface SubcategoryFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    categoryId: string;
    subcategory?: {
        id: string;
        categoryId: string;
        name: string;
        description?: string | null;
        icon?: string | null;
        displayOrder: number;
    };
}

export function SubcategoryFormDialog({
    isOpen,
    onClose,
    categoryId,
    subcategory,
}: SubcategoryFormDialogProps) {
    const isEditing = !!subcategory;
    const createMutation = useCreateSubcategory();
    const updateMutation = useUpdateSubcategory(subcategory?.id || "");

    const form = useForm<SubcategoryFormValues>({
        resolver: zodResolver(subcategorySchema),
        defaultValues: {
            name: subcategory?.name || "",
            description: subcategory?.description || "",
            icon: subcategory?.icon || "",
            displayOrder: subcategory?.displayOrder || 0,
        },
    });

    const onSubmit = async (values: SubcategoryFormValues) => {
        if (isEditing) {
            await updateMutation.mutateAsync(values);
        } else {
            await createMutation.mutateAsync({
                ...values,
                categoryId,
            });
        }
        onClose();
        form.reset();
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Subcategory" : "Create New Subcategory"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the subcategory details"
                            : "Add a new subcategory to this category"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Girlfriend" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Optional description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 💝" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="displayOrder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Order</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                {isEditing ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
