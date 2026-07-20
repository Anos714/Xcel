import { useMutation } from "@tanstack/react-query";

import { enhanceTweet } from "@/api/tweets/tweets";

export function useEnhanceTweet() {
  return useMutation({
    mutationFn: enhanceTweet,
  });
}
