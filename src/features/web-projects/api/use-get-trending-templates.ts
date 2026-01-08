"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetTrendingTemplates = () => {
    const query = useQuery({
        queryKey: ["web-templates", "trending"],
        queryFn: async () => {
            const response = await client.api["web-templates"]["trending"].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch trending templates");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
