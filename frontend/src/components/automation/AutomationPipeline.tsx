"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Globe,
  Inbox,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type StepStatus = "pending" | "active" | "done" | "error";

export type Phase = "idle" | "running" | "done" | "error";

export type PipelineStep = {
  id: string;
  label: string;
  detail?: string;
  status: StepStatus;
};

export type QueryTrack = {
  query: string;
  stages: {
    search: StepStatus;
    generate: StepStatus;
    save: StepStatus;
  };
  tweet?: {
    id: string;
    content: string;
    hashtags: string[] | null;
    query: string | null;
  };
};

const STAGES: { key: keyof QueryTrack["stages"]; label: string; icon: typeof Globe }[] = [
  { key: "search", label: "Research", icon: Globe },
  { key: "generate", label: "AI write", icon: Sparkles },
  { key: "save", label: "Queue", icon: Inbox },
];

const formatElapsed = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remaining = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remaining}`;
};

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "active") {
    return <Loader2 className="size-4 shrink-0 animate-spin text-primary" />;
  }

  if (status === "done") {
    return (
      <motion.span
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 24 }}
        className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15"
      >
        <Check className="size-3 text-primary" strokeWidth={3} />
      </motion.span>
    );
  }

  if (status === "error") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-destructive/15">
        <X className="size-3 text-destructive" strokeWidth={3} />
      </span>
    );
  }

  return <span className="size-4 shrink-0 rounded-full border border-border" />;
}

function QueryTrackCard({ track }: { track: QueryTrack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="rounded-xl border bg-card p-4 shadow-xs"
    >
      <div className="flex items-center gap-2">
        <span className="size-1.5 shrink-0 rounded-full bg-primary/60" />
        <p className="line-clamp-1 text-sm font-medium">{track.query}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {STAGES.map(({ key, label, icon: Icon }) => {
          const status = track.stages[key];

          return (
            <motion.span
              key={key}
              layout
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                status === "done" &&
                  "border-primary/30 bg-primary/10 text-primary",
                status === "active" &&
                  "border-primary/40 bg-primary/15 text-primary",
                status === "error" &&
                  "border-destructive/30 bg-destructive/10 text-destructive",
                status === "pending" &&
                  "border-border bg-muted/40 text-muted-foreground",
              )}
            >
              {status === "active" ? (
                <Loader2 className="size-3 animate-spin" />
              ) : status === "done" ? (
                <Check className="size-3" strokeWidth={3} />
              ) : status === "error" ? (
                <X className="size-3" />
              ) : (
                <Icon className="size-3" />
              )}
              {label}
            </motion.span>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {track.tweet ? (
          <motion.div
            key={track.tweet.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-lg border bg-muted/40 p-3">
              <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Inbox className="size-3" /> Added to pending queue
              </p>
              <p className="line-clamp-3 text-sm">{track.tweet.content}</p>
              {track.tweet.hashtags && track.tweet.hashtags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {track.tweet.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary"
                    >
                      {tag.startsWith("#") ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

interface AutomationPipelineProps {
  phase: Phase;
  steps: PipelineStep[];
  queries: QueryTrack[];
  elapsed: number;
  onCancel: () => void;
}

export function AutomationPipeline({
  phase,
  steps,
  queries,
  elapsed,
  onCancel,
}: AutomationPipelineProps) {
  const running = phase === "running";

  const completedSteps =
    steps.filter((step) => step.status === "done").length +
    queries.reduce(
      (total, track) =>
        total + STAGES.filter((s) => track.stages[s.key] === "done").length,
      0,
    );

  const totalSteps = steps.length + queries.length * STAGES.length;
  const percent = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const railPercent = steps.length
    ? Math.round(
        (steps.filter((step) => step.status === "done").length / steps.length) *
          100,
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden border-t border-border/60 bg-muted/20"
    >
      <div className="space-y-6 p-6">
        {/* Live status header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              {running ? (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              ) : null}
              <span
                className={cn(
                  "relative inline-flex size-2.5 rounded-full",
                  running
                    ? "bg-primary"
                    : phase === "done"
                      ? "bg-green-500"
                      : "bg-destructive",
                )}
              />
            </span>
            <span className="text-sm font-medium">
              {running
                ? "Automation running"
                : phase === "done"
                  ? "Automation complete"
                  : "Automation failed"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {formatElapsed(elapsed)}
            </span>
            {running ? (
              <Button
                size="xs"
                variant="ghost"
                onClick={onCancel}
                className="text-muted-foreground"
              >
                <X className="size-3" /> Cancel
              </Button>
            ) : null}
          </div>
        </div>

        {/* Global pipeline steps with an animated progress rail */}
        {steps.length > 0 ? (
          <div className="relative pl-0.5">
            <div className="absolute top-2 bottom-2 left-[9px] w-px bg-border" />
            <motion.div
              className="absolute top-2 left-[9px] w-px bg-primary"
              style={{ originY: 0 }}
              animate={{ height: `${railPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <ul className="space-y-3">
              {steps.map((step) => (
                <motion.li
                  key={step.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <StepIcon status={step.status} />
                  <div className="min-w-0 pt-px">
                    <p
                      className={cn(
                        "text-sm",
                        step.status === "pending" && "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </p>
                    {step.detail ? (
                      <p className="text-xs text-muted-foreground">
                        {step.detail}
                      </p>
                    ) : null}
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Per-topic research tracks */}
        {queries.length > 0 ? (
          <div className="space-y-3">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Researching topics
            </p>
            {queries.map((track) => (
              <QueryTrackCard key={track.query} track={track} />
            ))}
          </div>
        ) : null}

        {/* Overall progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {running
                ? "Working through the pipeline…"
                : phase === "done"
                  ? "All steps completed"
                  : "Run interrupted"}
            </span>
            <span className="tabular-nums">
              {completedSteps} / {totalSteps} steps
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
