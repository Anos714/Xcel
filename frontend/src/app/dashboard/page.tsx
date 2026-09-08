"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowUpRight, CalendarClock, CheckCircle2, MessageSquare, Send, XCircle } from "lucide-react";
import Link from "next/link";
import { getDashboardInfo } from "@/api/dashboard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["dashboard"], queryFn: getDashboardInfo });
  const stats = data?.stats;
  const statCards = [
    ["Total tweets", stats?.totalTweets ?? 0, Send],
    ["Pending", stats?.pendingTweets ?? 0, Activity],
    ["Posted", stats?.postedTweets ?? 0, CheckCircle2],
    ["Failed", stats?.failedTweets ?? 0, XCircle],
    ["Active queries", stats?.activeQueries ?? 0, MessageSquare],
  ] as const;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Good morning</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">Your content command center</h2>
          <p className="mt-2 text-muted-foreground">Monitor publishing, automation, and ideas from one calm workspace.</p>
        </div>
        <Link href="/tweets" className={cn(buttonVariants(), "gap-2")}><Send /> Create a tweet</Link>
      </section>

      {isError ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Could not load dashboard data. Check that the API is running.</p> : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map(([label, value, Icon]) => (
          <Card key={label} className="border-border/70 shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold">{isLoading ? "—" : value}</p></div>
              <div className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="size-5" /></div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between"><CardTitle>Recent tweets</CardTitle><Link href="/tweets" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}>View all <ArrowUpRight /></Link></CardHeader>
          <CardContent className="space-y-4">
            {data?.recentTweets?.length ? data.recentTweets.map((tweet) => (
              <div key={tweet.id} className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0">
                <p className="line-clamp-2 text-sm">{tweet.content}</p>
                <Badge variant={tweet.status === "posted" ? "default" : "secondary"}>{tweet.status}</Badge>
              </div>
            )) : <p className="text-sm text-muted-foreground">No recent tweets yet.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Upcoming schedule</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {data?.upcomingTweets?.length ? data.upcomingTweets.map((tweet) => (
              <div key={tweet.id} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                <CalendarClock className="mt-0.5 size-4 text-primary" />
                <div><p className="line-clamp-2 text-sm">{tweet.content}</p><p className="mt-1 text-xs text-muted-foreground">{tweet.scheduledFor ? new Date(tweet.scheduledFor).toLocaleString() : "Queued"}</p></div>
              </div>
            )) : <p className="text-sm text-muted-foreground">Nothing scheduled. Your next post can go here.</p>}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
