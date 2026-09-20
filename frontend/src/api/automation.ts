import { api } from "@/lib/axios";
import type { Tweet } from "@/types/tweets";

export const runAutomation = async () =>
  (
    await api.post<{ data: Tweet[] }>("/automation/run", undefined, {
      timeout: 120_000,
    })
  ).data.data;

export type AutomationTweet = Pick<
  Tweet,
  "id" | "content" | "hashtags" | "query"
>;

export type AutomationStreamEvent = {
  type: "phase" | "query" | "complete" | "error";
  step: string;
  label: string;
  detail?: string;
  status: "active" | "done" | "error";
  query?: string;
  tweet?: AutomationTweet;
  count?: number;
  message?: string;
};

/**
 * Runs an automation cycle and streams every subprocess (Tavily search,
 * Gemini generation, queue save) to the caller as Server-Sent Events.
 */
export const streamAutomation = async (
  onEvent: (event: AutomationStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> => {
  const response = await fetch(
    `${api.defaults.baseURL ?? ""}/automation/run/stream`,
    {
      method: "POST",
      signal,
      cache: "no-store",
    },
  );

  if (!response.ok || !response.body) {
    let message = `Automation request failed (${response.status})`;

    try {
      const payload = (await response.json()) as { message?: string };
      if (payload?.message) message = payload.message;
    } catch {
      /* response had no JSON body — keep the status message */
    }

    throw new Error(message);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const chunk = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);

      const payload = chunk
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice("data:".length).trim())
        .join("\n");

      if (!payload) continue;

      try {
        onEvent(JSON.parse(payload) as AutomationStreamEvent);
      } catch {
        /* skip a malformed chunk rather than killing the run */
      }
    }
  }
};
