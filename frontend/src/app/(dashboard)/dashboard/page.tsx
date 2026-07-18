"use client";

import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import RecentTweets from "@/components/dashboard/RecentTweets";
import StatsGrid from "@/components/dashboard/StatsGrid";
import UpcomingTweets from "@/components/dashboard/UpcomingTweets";
import { useDashBoard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashBoard();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="space-y-8">
      <StatsGrid stats={data?.stats} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentTweets tweets={data?.recentTweets} />

        <UpcomingTweets tweets={data?.upcomingTweets} />
      </div>
    </div>
  );
}
