"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Settings2 } from "lucide-react";
import { useState } from "react";
import { getSettings, updateSettings } from "@/api/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const client = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const [enabledOverride, setEnabledOverride] = useState<boolean>();
  const [timezone, setTimezone] = useState("");
  const [postingTimes, setPostingTimes] = useState("");
  const enabled = enabledOverride ?? data?.automationEnabled ?? false;
  const save = useMutation({ mutationFn: () => updateSettings(data!.id, { automationEnabled: enabled, timezone: timezone || data?.timezone || "UTC", postingTimes: (postingTimes || data?.postingTimes?.join(",") || "").split(",").map((time) => time.trim()).filter(Boolean) }), onSuccess: () => client.invalidateQueries({ queryKey: ["settings"] }) });
  return <div className="mx-auto w-full max-w-3xl space-y-6">
    <div><p className="text-sm font-medium text-primary">Workspace preferences</p><h2 className="mt-1 text-3xl font-semibold tracking-tight">Settings</h2><p className="mt-2 text-muted-foreground">Control how and when XOLO prepares content.</p></div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Settings2 className="size-5 text-primary" /> Automation preferences</CardTitle></CardHeader><CardContent className="space-y-6">{isLoading ? <p className="text-sm text-muted-foreground">Loading settings...</p> : <><div className="flex items-center justify-between rounded-xl border p-4"><div><p className="font-medium">Enable automation</p><p className="mt-1 text-sm text-muted-foreground">Allow scheduled workflows to generate content.</p></div><button type="button" onClick={() => setEnabledOverride(!enabled)} className={`relative h-6 w-11 rounded-full ${enabled ? "bg-primary" : "bg-muted"}`} aria-label="Toggle automation"><span className={`absolute top-1 size-4 rounded-full bg-white ${enabled ? "left-6" : "left-1"}`} /></button></div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-sm font-medium">Timezone<Input defaultValue={data?.timezone ?? "UTC"} onChange={(event) => setTimezone(event.target.value)} placeholder="UTC" /></label><label className="space-y-2 text-sm font-medium">Posting times<label className="block text-xs font-normal text-muted-foreground">Comma separated, e.g. 09:00, 17:30</label><Input defaultValue={data?.postingTimes?.join(", ") ?? ""} onChange={(event) => setPostingTimes(event.target.value)} /></label></div><div className="flex justify-end"><Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save changes</Button></div></>}</CardContent></Card>
    {save.isSuccess ? <p className="text-sm text-green-600 dark:text-green-400">Settings saved successfully.</p> : null}
  </div>;
}
