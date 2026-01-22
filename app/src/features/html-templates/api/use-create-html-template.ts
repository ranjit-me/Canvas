import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api["html-templates"]["$post"]>;
type RequestType = InferRequestType<typeof client.api["html-templates"]["$post"]>["json"];

export const useCreateHtmlTemplate = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api["html-templates"].$post({ json });

            if (!response.ok) {
                throw new Error("Failed to create template");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Template created successfully");
            queryClient.invalidateQueries({ queryKey: ["html-templates"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create template");
        },
    });

    return mutation;
};
