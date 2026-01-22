import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.leads.$post, 200>;
type RequestType = InferRequestType<typeof client.api.leads.$post>["json"];

export const useUpsertLead = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.leads.$post({ json });

            if (!response.ok) {
                throw new Error("Failed to save lead data");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Details saved successfully!");
            queryClient.invalidateQueries({ queryKey: ["lead"] });
        },
        onError: () => {
            toast.error("Failed to save details.");
        },
    });

    return mutation;
};
