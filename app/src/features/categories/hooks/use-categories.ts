import { client } from "@/lib/hono";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Category = {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    displayOrder: number;
    subcategories?: Subcategory[];
};

type Subcategory = {
    id: string;
    categoryId: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    displayOrder: number;
};

// Get all categories with subcategories
export const useGetCategories = () => {
    const query = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await client.api.categories.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};

// Create category
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        InferResponseType<typeof client.api.categories.$post>,
        Error,
        InferRequestType<typeof client.api.categories.$post>["json"]
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories.$post({ json });

            if (!response.ok) {
                throw new Error("Failed to create category");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category created successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error("Failed to create category");
        },
    });

    return mutation;
};

// Update category
export const useUpdateCategory = (id: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        InferResponseType<(typeof client.api.categories)[":id"]["$put"]>,
        Error,
        InferRequestType<(typeof client.api.categories)[":id"]["$put"]>["json"]
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"].$put({
                param: { id },
                json,
            });

            if (!response.ok) {
                throw new Error("Failed to update category");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category updated successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error("Failed to update category");
        },
    });

    return mutation;
};

// Delete category
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        InferResponseType<(typeof client.api.categories)[":id"]["$delete"]>,
        Error,
        string
    >({
        mutationFn: async (id: string) => {
            const response = await client.api.categories[":id"].$delete({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to delete category");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error("Failed to delete category");
        },
    });

    return mutation;
};

// Create subcategory
export const useCreateSubcategory = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        InferResponseType<typeof client.api.subcategories.$post>,
        Error,
        InferRequestType<typeof client.api.subcategories.$post>["json"]
    >({
        mutationFn: async (json) => {
            const response = await client.api.subcategories.$post({ json });

            if (!response.ok) {
                throw new Error("Failed to create subcategory");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Subcategory created successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error("Failed to create subcategory");
        },
    });

    return mutation;
};

// Update subcategory
export const useUpdateSubcategory = (id: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        InferResponseType<(typeof client.api.subcategories)[":id"]["$put"]>,
        Error,
        InferRequestType<(typeof client.api.subcategories)[":id"]["$put"]>["json"]
    >({
        mutationFn: async (json) => {
            const response = await client.api.subcategories[":id"].$put({
                param: { id },
                json,
            });

            if (!response.ok) {
                throw new Error("Failed to update subcategory");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Subcategory updated successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error("Failed to update subcategory");
        },
    });

    return mutation;
};

// Delete subcategory
export const useDeleteSubcategory = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        InferResponseType<(typeof client.api.subcategories)[":id"]["$delete"]>,
        Error,
        string
    >({
        mutationFn: async (id: string) => {
            const response = await client.api.subcategories[":id"].$delete({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to delete subcategory");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Subcategory deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error("Failed to delete subcategory");
        },
    });

    return mutation;
};
