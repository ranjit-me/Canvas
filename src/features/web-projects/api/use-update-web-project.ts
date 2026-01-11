import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<(typeof client.api)["web-projects"][":id"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof client.api)["web-projects"][":id"]["$patch"]>["json"];

type ContextType = {
    previousProjects: any;
    previousProject: any;
};

export const useUpdateWebProject = (id: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType, ContextType>({
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
        onMutate: async (newValues) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["web-projects"] });
            await queryClient.cancelQueries({ queryKey: ["web-project", { id }] });

            // Snapshot the previous values
            const previousProjects = queryClient.getQueryData(["web-projects"]);
            const previousProject = queryClient.getQueryData(["web-project", { id }]);

            // Optimistically update to the new value
            queryClient.setQueryData(["web-projects"], (old: any) => {
                if (!old) return old;
                return old.map((project: any) =>
                    project.id === id ? { ...project, ...newValues } : project
                );
            });

            queryClient.setQueryData(["web-project", { id }], (old: any) => {
                if (!old) return old;
                return { ...old, ...newValues };
            });

            // Return a context object with the snapshotted value
            return { previousProjects, previousProject };
        },
        onSuccess: () => {
            toast.success("Project updated.");
        },
        onError: (error, _newValues, context) => {
            toast.error(error.message);
            // Rollback to the previous value if mutation fails
            if (context) {
                queryClient.setQueryData(["web-projects"], context.previousProjects);
                queryClient.setQueryData(["web-project", { id }], context.previousProject);
            }
        },
        onSettled: () => {
            // Always refetch after error or success to keep server and client in sync
            queryClient.invalidateQueries({ queryKey: ["web-projects"] });
            queryClient.invalidateQueries({ queryKey: ["web-project", { id }] });
        },
    });

    return mutation;
};
