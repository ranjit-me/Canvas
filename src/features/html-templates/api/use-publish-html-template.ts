import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api["html-templates"][":id"]["publish"]["$post"]>;
type RequestType = InferRequestType<typeof client.api["html-templates"][":id"]["publish"]["$post"]>;

export const usePublishHtmlTemplate = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api["html-templates"][":id"]["publish"].$post({
                param,
            });

            if (!response.ok) {
                throw new Error("Failed to publish template");
            }

            return await response.json();
        },
        onSuccess: (_, { param }) => {
            toast.success("Template submitted for approval");
            queryClient.invalidateQueries({ queryKey: ["html-templates"] });
            queryClient.invalidateQueries({ queryKey: ["html-template", param.id] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to publish template");
        },
    });

    return mutation;
};
