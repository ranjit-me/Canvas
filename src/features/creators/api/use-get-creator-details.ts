import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetCreatorDetails = (creatorId: string) => {
    const query = useQuery({
        queryKey: ["creator-analytics", creatorId],
        queryFn: async () => {
            const response = await client.api["creator-analytics"][":creatorId"].$get({
                param: { creatorId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch creator details");
            }

            const data = await response.json();
            return data;
        },
        enabled: !!creatorId,
    });

    return query;
};
