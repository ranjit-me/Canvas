import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api["html-templates"][":id"]["$delete"]>;
// Custom type that flattens the input
type FlatRequestType = {
    id: string;
};

export const useDeleteHtmlTemplate = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, FlatRequestType>({
        mutationFn: async ({ id }) => {
            const response = await client.api["html-templates"][":id"].$delete({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to delete template");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Template deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["html-templates"] });
            queryClient.invalidateQueries({ queryKey: ["web-templates-admin"] });
            queryClient.invalidateQueries({ queryKey: ["web-templates"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete template");
        },
    });

    return mutation;
};
