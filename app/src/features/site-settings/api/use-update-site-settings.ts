import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type SiteSettingsPayload = {
    siteName?: string;
    siteLogo?: string;
    contactEmail?: string;
    contactPhone?: string;
    contactAddress?: string;
    aboutUsContent?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
};

export const useUpdateSiteSettings = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (json: SiteSettingsPayload) => {
            const response = await fetch("/api/admin/site-settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(json),
            });

            if (!response.ok) {
                throw new Error("Failed to update site settings");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Site settings updated successfully");
            queryClient.invalidateQueries({ queryKey: ["site-settings"] });
        },
        onError: () => {
            toast.error("Failed to update site settings");
        },
    });

    return mutation;
};
