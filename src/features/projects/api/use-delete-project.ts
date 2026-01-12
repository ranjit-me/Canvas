import { useMutation } from "@tanstack/react-query";

export const useDeleteProject = () => {
    return useMutation({
        mutationFn: async (values: any) => {
            return {};
        },
    });
};
