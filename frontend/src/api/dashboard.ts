import { api } from "@/lib/axios";
import type { DashboardStats, Tweet } from "@/types/dashboard";

export interface DashboardData {
  stats: DashboardStats;
  recentTweets: Tweet[];
  upcomingTweets: Tweet[];
}

export const getDashboardInfo = async (): Promise<DashboardData> => {
  const response = await api.get<{ data: DashboardData }>("/dashboard/");
  return response.data.data;
};
