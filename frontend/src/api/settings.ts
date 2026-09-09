import { api } from "@/lib/axios";

export interface Settings {
  id: string;
  automationEnabled: boolean;
  postingTimes: string[] | null;
  automationTimes: string[] | null;
  timezone: string | null;
}

export const getSettings = async () =>
  (await api.get<{ data: Settings }>("/settings")).data.data;
export const updateSettings = async (id: string, input: Partial<Settings>) =>
  (await api.patch<{ data: Settings }>(`/settings/${id}`, input)).data.data;
