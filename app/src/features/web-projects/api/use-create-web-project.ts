import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<(typeof client.api)["web-projects"]["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api)["web-projects"]["$post"]>["json"];

export const useCreateWebProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api["web-projects"].$post({ json });

            if (!response.ok) {
                const errorData = await response.json() as { error: string };
                throw new Error(errorData.error || "Something went wrong");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Project saved.");
            queryClient.invalidateQueries({ queryKey: ["web-projects"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
