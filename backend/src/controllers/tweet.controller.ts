import type { Request,Response } from "express";
import { tweetService } from "../services/tweet.service";
import { enhanceTweetSchema, getTweetsSchema, tweetIdSchema, tweetSchema, updateTweetSchema } from "../validators/tweet.validator";


type EnhanceTweetRes={
     success:boolean,
        message:string,
        error?:string,
        data?:{
            content:string
        }
}

export const enhanceTweet=async(req:Request,res:Response<EnhanceTweetRes>)=>{
    const result=enhanceTweetSchema.safeParse(req.body);
    if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: JSON.stringify(result.error.flatten().fieldErrors),
    });
  }

  const { content } = result.data;
  
try {
    const response=await tweetService.enhanceTweet(content)
    return res.status(200).json({
        success:true,
        message:"Query enhanced successfully",
        data:response
    })
} catch (error) {
    return res.status(500).json({
        success:false,
        message:"Internal server error",
        error:(error as Error).message||"Something went wrong"
    })
}
}


type ScheduleTweetRes={
     success:boolean,
        message:string,
        error?:string,
        data?:object
}


export const createTweet=async(req:Request,res:Response<ScheduleTweetRes>)=>{
 const result=tweetSchema.safeParse(req.body);
    if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: JSON.stringify(result.error.flatten().fieldErrors),
    });

  }  

  

  const {content,postType,hashtags,scheduledFor}=result.data
  
  try {
        const tweet=await tweetService.createTweet(content,postType,hashtags,scheduledFor)
        return res.status(200).json({
            success:true,
            message:"Tweet created successfully",
            data:tweet
        })
            
    } catch (error) {
         return res.status(500).json({
        success:false,
        message:"Internal server error",
        error:(error as Error).message||"Something went wrong"
    })
    }
}

export const getTweetsController = async (
  req: Request,
  res: Response
) => {
  try {
     

    const query = getTweetsSchema.parse(req.query);

    const tweets = await tweetService.getTweets(
      query.page,
      query.limit,
      query.status,
      query.type
    );

    return res.status(200).json({
      success: true,
      ...tweets,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};


export const updateTweetController = async (
  req: Request,
  res: Response
) => {
  try {
    

    const { tweetId } = tweetIdSchema.parse(req.params);

    const body = updateTweetSchema.parse(req.body);

    const tweet = await tweetService.updateTweet(
      
      tweetId,
      body
    );

    return res.status(200).json({
      success: true,
      data: tweet,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const deleteTweetController = async (
  req: Request,
  res: Response
) => {
  try {
      
    const { tweetId } = tweetIdSchema.parse(req.params);

    const response = await tweetService.deleteTweet( tweetId);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};