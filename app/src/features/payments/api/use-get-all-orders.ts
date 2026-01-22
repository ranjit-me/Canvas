import { useQuery } from "@tanstack/react-query";

export const useGetAllOrders = () => {
    const query = useQuery({
        queryKey: ["orders-admin"],
        queryFn: async () => {
            const response = await fetch("/api/subscriptions/all");

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
