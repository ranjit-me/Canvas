import { useQuery } from "@tanstack/react-query";

export const useGetSiteSettings = () => {
    const query = useQuery({
        queryKey: ["site-settings"],
        queryFn: async () => {
            const response = await fetch("/api/site-settings");

            if (!response.ok) {
                throw new Error("Failed to fetch site settings");
            }

            return await response.json();
        },
    });

    return query;
};
