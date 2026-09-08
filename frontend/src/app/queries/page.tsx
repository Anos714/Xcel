"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { createQuery, deleteQuery, getQueries, updateQuery } from "@/api/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function QueriesPage() {
  const client = useQueryClient();
  const [value, setValue] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["queries"], queryFn: getQueries });
  const refresh = () => client.invalidateQueries({ queryKey: ["queries"] });
  const add = useMutation({ mutationFn: () => createQuery(value.trim()), onSuccess: () => { setValue(""); refresh(); } });
  const toggle = useMutation({ mutationFn: ({ id, active }: { id: string; active: boolean }) => updateQuery(id, active), onSuccess: refresh });
  const remove = useMutation({ mutationFn: deleteQuery, onSuccess: refresh });

  return <div className="mx-auto w-full max-w-4xl space-y-6">
    <div><p className="text-sm font-medium text-primary">Content intelligence</p><h2 className="mt-1 text-3xl font-semibold tracking-tight">Queries</h2><p className="mt-2 text-muted-foreground">Manage the topics your automation watches for inspiration.</p></div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Search className="size-5 text-primary" /> Add a topic</CardTitle></CardHeader><CardContent><div className="flex gap-2"><Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="e.g. AI product updates" onKeyDown={(event) => { if (event.key === "Enter" && value.trim()) add.mutate(); }} /><Button onClick={() => add.mutate()} disabled={!value.trim() || add.isPending}><Plus /> Add query</Button></div></CardContent></Card>
    <Card><CardHeader><CardTitle>Tracked topics</CardTitle></CardHeader><CardContent className="space-y-3">{isLoading ? <p className="text-sm text-muted-foreground">Loading queries...</p> : data?.length ? data.map((item) => <div key={item.id} className="flex items-center justify-between rounded-lg border p-4"><div><p className="font-medium">{item.query}</p><p className="mt-1 text-xs text-muted-foreground">{item.active ? "Included in automation" : "Paused"}</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => toggle.mutate({ id: item.id, active: !item.active })} className={`relative h-6 w-11 rounded-full transition-colors ${item.active ? "bg-primary" : "bg-muted"}`} aria-label={`Toggle ${item.query}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${item.active ? "left-6" : "left-1"}`} /></button><Button variant="ghost" size="icon" onClick={() => remove.mutate(item.id)} aria-label={`Delete ${item.query}`}><Trash2 className="size-4" /></Button></div></div>) : <p className="text-sm text-muted-foreground">No queries yet. Add a topic to power automation.</p>}</CardContent></Card>
  </div>;
}
