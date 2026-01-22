import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api["promotional-banners"]["$post"]>;
type RequestType = InferRequestType<typeof client.api["promotional-banners"]["$post"]>["json"];

export const useCreateBanner = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api["promotional-banners"].$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Banner created successfully");
            queryClient.invalidateQueries({ queryKey: ["promotional-banners"] });
        },
        onError: () => {
            toast.error("Failed to create banner");
        },
    });

    return mutation;
};
