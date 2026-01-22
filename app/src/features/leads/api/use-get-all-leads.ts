import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetAllLeads = () => {
    const query = useQuery({
        queryKey: ["leads-admin"],
        queryFn: async () => {
            const response = await client.api.leads.all.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch leads");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
