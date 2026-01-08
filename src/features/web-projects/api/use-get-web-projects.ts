"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetWebProjects = () => {
    const query = useQuery({
        queryKey: ["web-projects"],
        queryFn: async () => {
            const response = await client.api["web-projects"].$get({
                query: {
                    page: "1",
                    limit: "100",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch web projects");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
