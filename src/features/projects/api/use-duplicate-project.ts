import { useMutation } from "@tanstack/react-query";

export const useDuplicateProject = () => {
    return useMutation({
        mutationFn: async (values: any) => {
            return {};
        },
    });
};
