"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetLatestTemplates = () => {
    const query = useQuery({
        queryKey: ["web-templates", "latest"],
        queryFn: async () => {
            const response = await client.api["web-templates"]["latest"].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch latest templates");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
