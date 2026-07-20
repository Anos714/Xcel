import { useQuery } from "@tanstack/react-query";

import { getTweets, GetTweetsParams } from "@/api/tweets/tweets";

export function useTweets(params: GetTweetsParams) {
  return useQuery({
    queryKey: ["tweets", params],

    queryFn: () => getTweets(params),

    placeholderData: (previous) => previous,
  });
}
