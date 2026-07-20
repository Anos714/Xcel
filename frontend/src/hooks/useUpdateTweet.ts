import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTweet } from "@/api/tweets/tweets";

export function useUpdateTweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTweet,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
    },
  });
}
