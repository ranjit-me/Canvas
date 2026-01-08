import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetWebProjectBySlug = (slug: string) => {
    return useQuery({
        queryKey: ["web-project", { slug }],
        queryFn: async () => {
            const response = await client.api["web-projects"].public[":slug"].$get({
                param: { slug },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch public project");
            }

            const result = await response.json();
            // Return the entire result which includes { data, type }
            return result;
        },
        enabled: !!slug,
    });
};
