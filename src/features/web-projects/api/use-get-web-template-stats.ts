import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetWebTemplateStats = () => {
    const query = useQuery({
        queryKey: ["web-template-stats"],
        queryFn: async () => {
            const response = await client.api["web-templates"].stats.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch web template stats");
            }

            const { totalOrders, countryStats, templateUsage } = await response.json();
            return { totalOrders, countryStats, templateUsage };
        },
    });

    return query;
};
