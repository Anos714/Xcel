export interface DashboardStats {
  totalTweets: number;
  pendingTweets: number;
  postedTweets: number;
  failedTweets: number;
  activeQueries: number;
}

export interface Tweet {
  id: string;
  type: string;
  content: string;
  status: "pending" | "posted" | "failed";
  scheduledFor: string | null;
  createdAt: string | null;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  dashboard: {
    stats: DashboardStats;
    recentTweets: Tweet[];
    upcomingTweets: Tweet[];
  };
}
