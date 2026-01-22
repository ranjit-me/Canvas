import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api["web-projects"][":id"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api["web-projects"][":id"]["$delete"]>["param"];

export const useDeleteWebProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (param) => {
            const response = await client.api["web-projects"][":id"].$delete({
                param,
            });

            if (!response.ok) {
                throw new Error("Failed to delete web project");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Web project deleted");
            queryClient.invalidateQueries({ queryKey: ["web-projects"] });
        },
        onError: () => {
            toast.error("Failed to delete web project");
        }
    });

    return mutation;
};
