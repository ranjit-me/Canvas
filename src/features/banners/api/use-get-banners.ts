import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetBanners = () => {
    const query = useQuery({
        queryKey: ["promotional-banners"],
        queryFn: async () => {
            const response = await client.api["promotional-banners"].$get();

            if (!response.ok) {
                throw new Error("Failed to fetch banners");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
