import {
  CheckCircle2,
  CircleDashed,
  MessageSquare,
  Send,
  XCircle,
} from "lucide-react";

import type { DashboardStats } from "@/types/dashboard";

import StatsCard from "./StatsCard";

interface StatsGridProps {
  stats: DashboardStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
      <StatsCard title="Total Tweets" value={stats.totalTweets} icon={Send} />

      <StatsCard
        title="Pending"
        value={stats.pendingTweets}
        icon={CircleDashed}
      />

      <StatsCard
        title="Posted"
        value={stats.postedTweets}
        icon={CheckCircle2}
      />

      <StatsCard title="Failed" value={stats.failedTweets} icon={XCircle} />

      <StatsCard
        title="Queries"
        value={stats.activeQueries}
        icon={MessageSquare}
      />
    </section>
  );
}
