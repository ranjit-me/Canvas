import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<(typeof client.api.payments)["verify"]["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.payments)["verify"]["$post"]>["json"];

export const useVerifyPayment = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.payments["verify"].$post({ json });

            if (!response.ok) {
                throw new Error("Failed to verify payment");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Payment successful! Template is now in your orders.");
            queryClient.invalidateQueries({ queryKey: ["web-projects"] });
        },
        onError: () => {
            toast.error("Payment verification failed.");
        },
    });

    return mutation;
};
