import { api } from "@/lib/axios";
import type { Tweet } from "@/types/tweets";

export const runAutomation = async () => (await api.post<{ data: Tweet[] }>("/automation/run")).data.data;
