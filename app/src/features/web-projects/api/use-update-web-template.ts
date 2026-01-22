import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api["web-templates"][":id"]["$patch"], 200>;
// Custom type that flattens the input
type FlatRequestType = {
    id: string;
} & InferRequestType<typeof client.api["web-templates"][":id"]["$patch"]>["json"];

export const useUpdateWebTemplate = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, FlatRequestType>({
        mutationFn: async ({ id, ...json }) => {
            const response = await client.api["web-templates"][":id"].$patch({
                param: { id },
                json,
            });

            if (!response.ok) {
                throw new Error("Failed to update template");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Template updated");
            queryClient.invalidateQueries({ queryKey: ["web-templates-admin"] });
            queryClient.invalidateQueries({ queryKey: ["web-templates"] });
        },
        onError: () => {
            toast.error("Failed to update template");
        },
    });

    return mutation;
};
