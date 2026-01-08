import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<(typeof client.api)["web-projects"][":id"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof client.api)["web-projects"][":id"]["$patch"]>["json"];

export const useUpdateWebProject = (id: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api["web-projects"][":id"].$patch({
                param: { id },
                json,
            });

            if (!response.ok) {
                const errorData = await response.json() as { error: string };
                throw new Error(errorData.error || "Failed to update project");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Project updated.");
            queryClient.invalidateQueries({ queryKey: ["web-projects"] });
            queryClient.invalidateQueries({ queryKey: ["web-project", { id }] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
