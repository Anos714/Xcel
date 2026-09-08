"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Bot, CheckCircle2, Loader2, Play, Search } from "lucide-react";
import { runAutomation } from "@/api/automation";
import { getQueries } from "@/api/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AutomationPage() {
  const client = useQueryClient();
  const { data: queries, isLoading: queriesLoading } = useQuery({
    queryKey: ["queries"],
    queryFn: getQueries,
  });
  const hasActiveQuery = queries?.some((query) => query.active) ?? false;
  const run = useMutation({ mutationFn: runAutomation, onSuccess: () => client.invalidateQueries({ queryKey: ["dashboard"] }) });
  return <div className="mx-auto w-full max-w-4xl space-y-6">
    <div><p className="text-sm font-medium text-primary">Hands-off publishing</p><h2 className="mt-1 text-3xl font-semibold tracking-tight">Automation</h2><p className="mt-2 text-muted-foreground">Generate a fresh batch from your active queries when you are ready.</p></div>
    <Card className="overflow-hidden"><div className="bg-primary/10 p-8"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Bot /></div><h3 className="mt-5 text-2xl font-semibold">Run content automation</h3><p className="mt-2 max-w-xl text-muted-foreground">Xcel will research your active topics, generate tweet ideas, and add them to your pending queue for review.</p>{!queriesLoading && !hasActiveQuery ? <div className="mt-5 flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200"><p className="flex items-center gap-2 font-medium"><Search className="size-4" /> Add and activate a query before running automation.</p><Link href="/queries" className="font-medium underline underline-offset-4">Manage queries</Link></div> : null}<Button className="mt-6" onClick={() => run.mutate()} disabled={run.isPending || queriesLoading || !hasActiveQuery}>{run.isPending ? <Loader2 className="animate-spin" /> : <Play />} {run.isPending ? "Running automation..." : "Run automation now"}</Button></div><CardContent className="grid gap-4 p-6 sm:grid-cols-3"><div><p className="font-medium">1. Research</p><p className="mt-1 text-sm text-muted-foreground">Find timely signals from your topics.</p></div><div><p className="font-medium">2. Generate</p><p className="mt-1 text-sm text-muted-foreground">Turn insights into on-brand ideas.</p></div><div><p className="font-medium">3. Review</p><p className="mt-1 text-sm text-muted-foreground">Edit and approve before publishing.</p></div></CardContent></Card>
    {run.isSuccess ? <p className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400"><CheckCircle2 className="size-4" /> Automation completed and new ideas were added to your queue.</p> : null}
    {run.isError ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{run.error instanceof Error ? run.error.message : "Automation could not run. Please try again."}</p> : null}
  </div>;
}
