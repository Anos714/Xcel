import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTweet } from "@/api/tweets/tweets";

export function useDeleteTweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTweet,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
    },
  });
}
