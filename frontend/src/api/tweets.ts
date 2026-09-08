import { api } from "@/lib/axios";
import type { GetTweetResponse, Tweet } from "@/types/tweets";

export interface CreateTweetInput {
  content: string;
  postType: "now" | "scheduled";
  hashtags?: string[];
  scheduledFor?: string;
}

export const getTweets = async (params: { page?: number; limit?: number; status?: string; type?: string } = {}) => {
  const response = await api.get<GetTweetResponse>("/tweets", { params });
  return response.data.data;
};

export const createTweet = async (input: CreateTweetInput) => (await api.post<{ data: Tweet }>("/tweets", input)).data.data;
export const enhanceTweet = async (content: string) => (await api.post<{ data: { content: string } }>("/tweets/enhance", { content })).data.data;
export const updateTweet = async (id: string, input: Partial<Pick<Tweet, "content" | "hashtags" | "scheduledFor">>) =>
  (await api.patch<{ data: Tweet }>(`/tweets/${id}`, input)).data.data;
export const deleteTweet = async (id: string) => api.delete(`/tweets/${id}`);
