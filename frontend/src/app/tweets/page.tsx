"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarClock, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { createTweet, deleteTweet, enhanceTweet, getTweets } from "@/api/tweets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function TweetsPage() {
  const client = useQueryClient();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [postType, setPostType] = useState<"now" | "scheduled">("now");
  const { data, isLoading } = useQuery({ queryKey: ["tweets"], queryFn: () => getTweets({ page: 1, limit: 50 }) });
  const refresh = () => Promise.all([
    client.invalidateQueries({ queryKey: ["tweets"] }),
    client.invalidateQueries({ queryKey: ["dashboard"] }),
  ]);
  const create = useMutation({
    mutationFn: () => createTweet({ content, postType, hashtags: hashtags.split(",").map((tag) => tag.trim()).filter(Boolean), ...(postType === "scheduled" && scheduledFor ? { scheduledFor: new Date(scheduledFor).toISOString() } : {}) }),
    onSuccess: () => { setContent(""); setHashtags(""); setScheduledFor(""); void refresh(); },
  });
  const enhance = useMutation({ mutationFn: () => enhanceTweet(content), onSuccess: (result) => setContent(result.content) });
  const remove = useMutation({ mutationFn: deleteTweet, onSuccess: () => void refresh() });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div><p className="text-sm font-medium text-primary">Publishing studio</p><h2 className="mt-1 text-3xl font-semibold tracking-tight">Tweets</h2><p className="mt-2 text-muted-foreground">Draft, enhance, and schedule content with confidence.</p></div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="size-5 text-primary" /> Create a tweet</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="What do you want to share?" className="min-h-32 resize-none text-base" maxLength={280} />
          <div className="flex justify-between text-xs text-muted-foreground"><span>{content.length}/280 characters</span><span>Tip: keep it clear and conversational.</span></div>
          <div className="grid gap-3 md:grid-cols-3">
            <Input value={hashtags} onChange={(event) => setHashtags(event.target.value)} placeholder="Hashtags, comma separated" />
            <select value={postType} onChange={(event) => setPostType(event.target.value as "now" | "scheduled")} className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"><option value="now">Post immediately</option><option value="scheduled">Schedule for later</option></select>
            {postType === "scheduled" ? <Input type="datetime-local" value={scheduledFor} onChange={(event) => setScheduledFor(event.target.value)} /> : <div />}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => enhance.mutate()} disabled={!content.trim() || enhance.isPending}>{enhance.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />} Enhance with AI</Button>
            <Button onClick={() => create.mutate()} disabled={!content.trim() || create.isPending}>{create.isPending ? <Loader2 className="animate-spin" /> : <CalendarClock />} {postType === "now" ? "Publish tweet" : "Schedule tweet"}</Button>
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Your content queue</CardTitle></CardHeader><CardContent>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading tweets...</p> : data?.data?.length ? <div className="space-y-3">{data.data.map((tweet) => <div key={tweet.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="line-clamp-2 text-sm">{tweet.content}</p><div className="mt-2 flex gap-2"><Badge variant="secondary">{tweet.type}</Badge><Badge variant={tweet.status === "posted" ? "default" : tweet.status === "failed" ? "destructive" : "secondary"}>{tweet.status}</Badge></div></div><Button variant="ghost" size="icon" aria-label="Delete tweet" disabled={tweet.type !== "custom" || tweet.status === "posted"} onClick={() => remove.mutate(tweet.id)}><Trash2 className="size-4" /></Button></div>)}</div> : <p className="text-sm text-muted-foreground">Your queue is empty. Create your first tweet above.</p>}
      </CardContent></Card>
    </div>
  );
}
