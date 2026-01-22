import { useMutation } from "@tanstack/react-query";

export const useCreateProject = () => {
    const mutation = useMutation({
        mutationFn: async (values: any) => {
            // Mock implementation as the feature seems to be removed or moved
            console.log("Mock create project", values);
            return { data: { id: "mock-id" } };
        },
    });

    return mutation;
};
