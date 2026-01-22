import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = any;
type RequestType = any;

export const useRemoveBg = () => {
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await (client.api as any).ai["remove-bg"].$post({ json });
      return await response.json();
    },
  });

  return mutation;
};
