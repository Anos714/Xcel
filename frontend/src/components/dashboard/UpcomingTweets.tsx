import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { Tweet } from "@/types/dashboard";

interface Props {
  tweets: Tweet[];
}

export default function UpcomingTweets({ tweets }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tweets</CardTitle>
      </CardHeader>

      <CardContent>
        {tweets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming tweets.</p>
        ) : (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="flex items-start justify-between gap-4 border-b pb-4 last:border-none"
              >
                <div className="space-y-2">
                  <p className="line-clamp-2 text-sm">{tweet.content}</p>

                  <Badge variant="secondary">Scheduled</Badge>
                </div>

                <div className="text-right text-xs text-muted-foreground">
                  {tweet.scheduledFor
                    ? new Date(tweet.scheduledFor).toLocaleString()
                    : "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
