import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api["html-templates"][":id"]["$patch"]>;

export const useUpdateHtmlTemplate = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, {
        id?: string;
        htmlCode?: string;
        cssCode?: string;
        jsCode?: string;
        componentCode?: string;
        slug?: string;
        isPublished?: boolean;
        status?: string;
        isActive?: boolean;
        isFree?: boolean;
    }>({
        mutationFn: async ({ id: paramId, ...json }) => {
            const targetId = paramId || id;
            if (!targetId) {
                throw new Error("Template ID is required");
            }

            const response = await client.api["html-templates"][":id"].$patch({
                param: { id: targetId },
                json,
            });

            if (!response.ok) {
                throw new Error("Failed to update template");
            }

            return await response.json();
        },
        onSuccess: (_, variables) => {
            const targetId = variables.id || id;
            toast.success("Template updated successfully");
            queryClient.invalidateQueries({ queryKey: ["html-templates"] });
            queryClient.invalidateQueries({ queryKey: ["web-templates-admin"] });
            queryClient.invalidateQueries({ queryKey: ["web-templates"] });
            if (targetId) {
                queryClient.invalidateQueries({ queryKey: ["html-template", targetId] });
            }
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update template");
        },
    });

    return mutation;
};
