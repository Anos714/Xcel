import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { Tweet } from "@/types/dashboard";

interface Props {
  tweets: Tweet[];
}

export default function RecentTweets({ tweets }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tweets</CardTitle>
      </CardHeader>

      <CardContent>
        {tweets.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent tweets found.
          </p>
        ) : (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="flex items-start justify-between gap-4 border-b pb-4 last:border-none"
              >
                <div className="space-y-2">
                  <p className="line-clamp-2 text-sm">{tweet.content}</p>

                  <div className="flex gap-2">
                    <Badge variant="secondary">{tweet.type}</Badge>

                    <Badge
                      variant={
                        tweet.status === "posted"
                          ? "default"
                          : tweet.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {tweet.status}
                    </Badge>
                  </div>
                </div>

                <p className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(tweet.createdAt || "").toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
