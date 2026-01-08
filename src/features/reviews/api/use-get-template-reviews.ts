import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTemplateReviews = (templateId: string) => {
    const query = useQuery({
        enabled: !!templateId,
        queryKey: ["template-reviews", templateId],
        queryFn: async () => {
            const response = await client.api["template-reviews"][":templateId"].$get({
                param: { templateId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch reviews");
            }

            const { reviews, averageRating, totalReviews } = await response.json();
            return { reviews, averageRating, totalReviews };
        },
    });

    return query;
};
