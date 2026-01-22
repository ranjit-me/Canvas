"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetWebTemplates = () => {
    const query = useQuery({
        queryKey: ["web-templates"],
        queryFn: async () => {
            const response = await client.api["web-templates"].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch web templates");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
