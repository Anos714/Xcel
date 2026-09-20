"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import { Bot, CheckCircle2, Loader2, Play, Search } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { getQueries } from "@/api/queries";
import { streamAutomation, type AutomationStreamEvent } from "@/api/automation";
import {
  AutomationPipeline,
  type Phase,
  type PipelineStep,
  type QueryTrack,
} from "@/components/automation/AutomationPipeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type State = {
  phase: Phase;
  steps: PipelineStep[];
  queries: QueryTrack[];
  error?: string;
  count?: number;
};

type Action = AutomationStreamEvent | { type: "start" } | { type: "reset" };

const initialState: State = { phase: "idle", steps: [], queries: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { phase: "running", steps: [], queries: [] };

    case "reset":
      return initialState;

    case "phase": {
      const next: PipelineStep = {
        id: action.step,
        label: action.label,
        detail: action.detail,
        status: action.status,
      };

      const index = state.steps.findIndex((step) => step.id === action.step);

      if (index === -1) {
        return { ...state, steps: [...state.steps, next] };
      }

      const steps = state.steps.slice();
      steps[index] = { ...steps[index], ...next };

      return { ...state, steps };
    }

    case "query": {
      const separator = action.step.indexOf(":");
      const stage = action.step.slice(0, separator) as keyof QueryTrack["stages"];
      const query = action.query ?? action.step.slice(separator + 1);

      if (!query) return state;

      const index = state.queries.findIndex((track) => track.query === query);
      const base: QueryTrack =
        index === -1
          ? {
              query,
              stages: { search: "pending", generate: "pending", save: "pending" },
            }
          : state.queries[index];

      const updated: QueryTrack = {
        ...base,
        stages: { ...base.stages, [stage]: action.status },
        tweet: action.tweet ?? base.tweet,
      };

      if (index === -1) {
        return { ...state, queries: [...state.queries, updated] };
      }

      const queries = state.queries.slice();
      queries[index] = updated;

      return { ...state, queries };
    }

    case "complete":
      return {
        ...state,
        phase: "done",
        count:
          action.count ??
          state.queries.filter((track) => track.stages.save === "done").length,
      };

    case "error":
      return {
        ...state,
        phase: "error",
        error: action.message ?? "Automation could not run. Please try again.",
      };

    default:
      return state;
  }
}

export default function AutomationPage() {
  const client = useQueryClient();
  const { data: queries, isLoading: queriesLoading } = useQuery({
    queryKey: ["queries"],
    queryFn: getQueries,
  });
  const hasActiveQuery = queries?.some((query) => query.active) ?? false;

  const [state, dispatch] = useReducer(reducer, initialState);
  const [elapsed, setElapsed] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // Abort the in-flight run if the user navigates away mid-cycle.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Live stopwatch that only ticks while a run is in progress.
  useEffect(() => {
    if (state.phase !== "running") return;

    const interval = setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [state.phase]);

  const run = useCallback(async () => {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setElapsed(0);
    dispatch({ type: "start" });

    try {
      await streamAutomation((event) => dispatch(event), controller.signal);
      await client.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (error) {
      // A user-initiated cancel should quietly return to the idle state.
      if (controller.signal.aborted) {
        dispatch({ type: "reset" });
        return;
      }

      dispatch({
        type: "error",
        step: "error",
        label: "Automation failed",
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Automation could not run. Please try again.",
      });
    }
  }, [client]);

  const running = state.phase === "running";
  const buttonLabel = running
    ? "Running automation..."
    : state.phase === "error"
      ? "Try again"
      : state.phase === "done"
        ? "Run automation again"
        : "Run automation now";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Hands-off publishing</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Automation
        </h2>
        <p className="mt-2 text-muted-foreground">
          Generate a fresh batch from your active queries when you are ready.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-primary/10 p-8">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Bot />
          </div>
          <h3 className="mt-5 text-2xl font-semibold">Run content automation</h3>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Xcel will research your active topics, generate tweet ideas, and add
            them to your pending queue for review.
          </p>

          {!queriesLoading && !hasActiveQuery ? (
            <div className="mt-5 flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200">
              <p className="flex items-center gap-2 font-medium">
                <Search className="size-4" /> Add and activate a query before
                running automation.
              </p>
              <Link
                href="/queries"
                className="font-medium underline underline-offset-4"
              >
                Manage queries
              </Link>
            </div>
          ) : null}

          <Button
            className="mt-6"
            onClick={run}
            disabled={running || queriesLoading || !hasActiveQuery}
          >
            {running ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Play />
            )}{" "}
            {buttonLabel}
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {state.phase !== "idle" ? (
            <AutomationPipeline
              key="pipeline"
              phase={state.phase}
              steps={state.steps}
              queries={state.queries}
              elapsed={elapsed}
              onCancel={() => abortRef.current?.abort()}
            />
          ) : null}
        </AnimatePresence>

        <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
          {state.phase === "idle" ? (
            <>
              <div>
                <p className="font-medium">1. Research</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Find timely signals from your topics.
                </p>
              </div>
              <div>
                <p className="font-medium">2. Generate</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Turn insights into on-brand ideas.
                </p>
              </div>
              <div>
                <p className="font-medium">3. Review</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Edit and approve before publishing.
                </p>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      {state.phase === "done" ? (
        <p className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-4" /> Automation completed and{" "}
          {state.count ?? 0} new tweet{(state.count ?? 0) === 1 ? "" : "s"} added
          to your queue.
        </p>
      ) : null}

      {state.phase === "error" ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
