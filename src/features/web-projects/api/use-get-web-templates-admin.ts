import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetWebTemplatesAdmin = () => {
    const query = useQuery({
        queryKey: ["web-templates-admin"],
        queryFn: async () => {
            const response = await client.api["web-templates"].admin.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch web templates for admin");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
