import { useQuery } from "@tanstack/react-query";

export const useGetProjects = () => {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            return { pages: [{ data: [] }] };
        },
    }) as any;
};
