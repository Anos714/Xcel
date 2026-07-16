import { env } from "../config/env";
import { db } from "../db";
import { tweets } from "../db/schema";
import AppError from "../utils/AppError";

type BufferPost = {
  id: string;
  text: string;
  dueAt: string | null;
};

type GraphQLResponse = {
  data?: {
    createPost?: {
      post?: BufferPost;
      message?: string;
    };
  };
  errors?: {
    message: string;
  }[];
};

export const postTweet = async (content: string, hashtags: string[]): Promise<BufferPost> => {

     const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess {
          post {
            id
            text
            dueAt
          }
        }

        ... on MutationError {
          message
        }
      }
    }
  `;

  const finalContent = `${content}\n${hashtags
    .map((tag) => `#${tag}`)
    .join(" ")}`;

  const variables = {
    input: {
      channelId: env.BUFFER_CHANNEL_ID,
      text: finalContent,
      schedulingType: "automatic",
      mode:"shareNow"
    },
  };

  const response = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.BUFFER_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });

  const result = (await response.json()) as GraphQLResponse;

  if (!response.ok) {
    throw new AppError(`Buffer API Error (${response.status})`,502);
  }

  if (result.errors?.length) {
    throw new AppError(result.errors[0]?.message||"Something went wrong in buffer api",502);
  }

  const post = result.data?.createPost?.post;

  if (!post) {
   
    throw new AppError(
      result.data?.createPost?.message ?? "Failed to create Buffer post.",502
    );
  }

  return post;
  
 
};
