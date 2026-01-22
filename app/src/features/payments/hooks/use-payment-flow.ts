import { useCreateOrder } from "../api/use-create-order";
import { useVerifyPayment } from "../api/use-verify-payment";
import { useRazorpay } from "./use-razorpay";
import { toast } from "sonner";

export const usePaymentFlow = () => {
    const createOrder = useCreateOrder();
    const verifyPayment = useVerifyPayment();
    const { openCheckout } = useRazorpay();

    const processPayment = async ({
        amount,
        projectId,
        onSuccess
    }: {
        amount: number;
        projectId: string;
        onSuccess?: () => void;
    }) => {
        try {
            const order = await createOrder.mutateAsync({
                amount,
                projectId,
            });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.data.amount,
                currency: order.data.currency,
                name: "ELYX",
                description: "Template Purchase",
                order_id: order.data.id,
                handler: async (response: any) => {
                    try {
                        await verifyPayment.mutateAsync({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            projectId,
                        });
                        if (onSuccess) onSuccess();
                    } catch (error) {
                        console.error("PAYMENT_VERIFICATION_ERROR", error);
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                },
                theme: {
                    color: "#9333ea",
                },
            };

            await openCheckout(options);
        } catch (error) {
            console.error("PAYMENT_FLOW_ERROR", error);
        }
    };

    return {
        processPayment,
        isPreparing: createOrder.isPending,
        isVerifying: verifyPayment.isPending,
    };
};
