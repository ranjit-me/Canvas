import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetHtmlTemplates = (filters?: {
    status?: string;
    category?: string;
    creatorId?: string;
    isActive?: boolean;
}) => {
    return useQuery({
        queryKey: ["html-templates", filters],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (filters?.status) params.append("status", filters.status);
            if (filters?.category) params.append("category", filters.category);
            if (filters?.creatorId) params.append("creatorId", filters.creatorId);
            if (filters?.isActive !== undefined) params.append("isActive", String(filters.isActive));

            const response = await client.api["html-templates"].$get({
                query: Object.fromEntries(params),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch HTML templates");
            }

            return await response.json();
        },
    });
};
