import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api["promotional-banners"][":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api["promotional-banners"][":id"]["$patch"]>["json"];

export const useUpdateBanner = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api["promotional-banners"][":id"].$patch({
                param: { id: id! },
                json,
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Banner updated successfully");
            queryClient.invalidateQueries({ queryKey: ["promotional-banners"] });
        },
        onError: () => {
            toast.error("Failed to update banner");
        },
    });

    return mutation;
};
