import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<(typeof client.api.payments)["create-order"]["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.payments)["create-order"]["$post"]>["json"];

export const useCreateOrder = () => {
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.payments["create-order"].$post({ json });

            if (!response.ok) {
                throw new Error("Failed to create order");
            }

            return await response.json();
        },
        onError: () => {
            toast.error("Failed to initialize payment.");
        },
    });

    return mutation;
};
