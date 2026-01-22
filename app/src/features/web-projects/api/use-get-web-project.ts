"use client";

import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<(typeof client.api)["web-projects"][":id"]["$get"], 200>;

export const useGetWebProject = (id: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["web-project", { id }],
        queryFn: async () => {
            const response = await client.api["web-projects"][":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch project");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
