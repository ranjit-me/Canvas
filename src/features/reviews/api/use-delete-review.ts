import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api["template-reviews"][":reviewId"]["$delete"]>;
type RequestType = InferRequestType<typeof client.api["template-reviews"][":reviewId"]["$delete"]>;

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ param }) => {
            const response = await client.api["template-reviews"][":reviewId"]["$delete"]({
                param,
            });

            if (!response.ok) {
                throw new Error("Failed to delete review");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Review deleted");
            queryClient.invalidateQueries({ queryKey: ["template-reviews"] });
        },
        onError: () => {
            toast.error("Failed to delete review");
        },
    });

    return mutation;
};
