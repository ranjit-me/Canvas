import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetHtmlTemplate = (templateId: string | null) => {
    return useQuery({
        queryKey: ["html-template", templateId],
        queryFn: async () => {
            if (!templateId) {
                throw new Error("Template ID is required");
            }

            const response = await client.api["html-templates"][":id"].$get({
                param: { id: templateId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch HTML template");
            }

            const data = await response.json();
            return data.template;
        },
        enabled: !!templateId, // Only run query if templateId exists
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });
};
