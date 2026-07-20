import { api } from "@/lib/axios";
import { GetTweetResponse } from "@/types/tweets";

export interface GetTweetsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "pending" | "posted" | "failed";
  type?: "custom" | "automation";
}

export interface CreateTweetPayload {
  content: string;
  hashtags?: string[];
  postType: "now" | "scheduled";
  scheduledFor?: string;
}

export interface UpdateTweetPayload {
  id: string;
  content: string;
  hashtags?: string[];
  scheduledFor?: string | null;
}

export const getTweets = async (
  params: GetTweetsParams,
): Promise<GetTweetResponse> => {
  const { data } = await api.get("/tweets", {
    params,
  });

  return data.data;
};

export const createTweet = async (payload: CreateTweetPayload) => {
  const { data } = await api.post("/tweets", payload);

  return data.data;
};

export const updateTweet = async (payload: UpdateTweetPayload) => {
  const { id, ...body } = payload;

  const { data } = await api.patch(`/tweets/${id}`, body);

  return data.data;
};

export const deleteTweet = async (id: string) => {
  const { data } = await api.delete(`/tweets/${id}`);

  return data.data;
};

export const enhanceTweet = async (id: string) => {
  const { data } = await api.post(`/tweets/${id}/enhance`);

  return data.data;
};
