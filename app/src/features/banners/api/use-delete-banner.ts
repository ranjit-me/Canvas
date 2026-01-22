import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api["promotional-banners"][":id"]["$delete"]>;

export const useDeleteBanner = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api["promotional-banners"][":id"].$delete({
                param: { id: id! },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Banner deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["promotional-banners"] });
        },
        onError: () => {
            toast.error("Failed to delete banner");
        },
    });

    return mutation;
};
