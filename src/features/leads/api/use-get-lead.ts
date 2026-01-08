import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetLead = () => {
    const query = useQuery({
        queryKey: ["lead"],
        queryFn: async () => {
            const response = await client.api.leads.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch lead data");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
