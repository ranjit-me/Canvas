import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api["web-templates"]["sync"]["$post"], 200>;

export const useSyncWebTemplates = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api["web-templates"]["sync"]["$post"]();

            if (!response.ok) {
                throw new Error("Failed to sync templates");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Templates synced");
            queryClient.invalidateQueries({ queryKey: ["web-templates-admin"] });
            queryClient.invalidateQueries({ queryKey: ["web-templates"] });
        },
        onError: () => {
            toast.error("Failed to sync templates");
        },
    });

    return mutation;
};
