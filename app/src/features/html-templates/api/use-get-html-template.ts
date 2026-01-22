import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetHtmlTemplate = (id: string) => {
    return useQuery({
        queryKey: ["html-template", id],
        queryFn: async () => {
            const response = await client.api["html-templates"][":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch HTML template");
            }

            return await response.json();
        },
        enabled: !!id,
    });
};
