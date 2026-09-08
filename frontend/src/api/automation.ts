import { api } from "@/lib/axios";
import type { Tweet } from "@/types/tweets";

export const runAutomation = async () =>
  (
    await api.post<{ data: Tweet[] }>("/automation/run", undefined, {
      timeout: 120_000,
    })
  ).data.data;
