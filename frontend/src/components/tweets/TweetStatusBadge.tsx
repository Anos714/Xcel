import { Badge } from "@/components/ui/badge";

interface TweetStatusBadgeProps {
  status: "pending" | "posted" | "failed";
}

export default function TweetStatusBadge({ status }: TweetStatusBadgeProps) {
  switch (status) {
    case "posted":
      return <Badge className="bg-green-500 hover:bg-green-600">Posted</Badge>;

    case "pending":
      return <Badge variant="secondary">Pending</Badge>;

    case "failed":
      return <Badge variant="destructive">Failed</Badge>;

    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}
