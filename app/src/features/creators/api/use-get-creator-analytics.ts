import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetCreatorAnalytics = () => {
    const query = useQuery({
        queryKey: ["creator-analytics"],
        queryFn: async () => {
            const response = await client.api["creator-analytics"].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch creator analytics");
            }

            const data = await response.json();
            return data;
        },
    });

    return query;
};
