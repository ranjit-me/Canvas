"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetTemplatesByCategory = (category: string) => {
    const query = useQuery({
        queryKey: ["web-templates", "by-category", category],
        queryFn: async () => {
            const response = await client.api["web-templates"]["by-category"][":category"].$get({
                param: { category }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch templates by category");
            }

            const { data } = await response.json();
            return data;
        },
        enabled: !!category,
    });

    return query;
};
