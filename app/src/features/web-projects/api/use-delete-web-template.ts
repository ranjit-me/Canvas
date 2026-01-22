import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api["web-templates"][":id"]["$delete"]>;

export const useDeleteWebTemplate = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, { id: string }>({
        mutationFn: async ({ id }) => {
            const response = await client.api["web-templates"][":id"].$delete({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to delete template");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Template deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["web-templates"] });
            queryClient.invalidateQueries({ queryKey: ["admin-web-templates"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete template");
        },
    });

    return mutation;
};
