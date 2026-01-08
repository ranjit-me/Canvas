import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteLead = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/leads/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete lead");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Lead deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["leads-admin"] });
        },
        onError: () => {
            toast.error("Failed to delete lead");
        },
    });

    return mutation;
};
