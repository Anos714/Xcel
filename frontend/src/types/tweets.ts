export interface Tweet {
  id: string;
  content: string;
  hashtags: string[] | null;
  query: string | null;
  type: "custom" | "automation";
  status: "pending" | "posted" | "failed";
  scheduledFor: string | null;
  postedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetTweetResponse {
  success: boolean;
  message: string;
  data: {
    data: Tweet[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
