import type { NextFunction, Request,Response } from "express";
import { tweetService } from "../services/tweet.service";
import { enhanceTweetSchema, getTweetsSchema, tweetIdSchema, tweetSchema, updateTweetSchema } from "../validators/tweet.validator";
import { catchAsync } from "../utils/catchAsync";


type EnhanceTweetRes={
     success:boolean,
        message:string,
        error?:string,
        data?:{
            content:string
        }
}

export const enhanceTweet=catchAsync(async(req:Request,res:Response<EnhanceTweetRes>,next:NextFunction)=>{
    const result=enhanceTweetSchema.safeParse(req.body);
    if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: JSON.stringify(result.error.flatten().fieldErrors),
    });
  }

  const { content } = result.data;
  

    const response=await tweetService.enhanceTweet(content)
    return res.status(200).json({
        success:true,
        message:"Query enhanced successfully",
        data:response
    })

})


type ScheduleTweetRes={
     success:boolean,
        message:string,
        error?:string,
        data?:object
}


export const createTweet=catchAsync(async(req:Request,res:Response<ScheduleTweetRes>,next:NextFunction)=>{
 const result=tweetSchema.safeParse(req.body);
    if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: JSON.stringify(result.error.flatten().fieldErrors),
    });

  }  

  

  const {content,postType,hashtags,scheduledFor}=result.data
  
  
        const tweet=await tweetService.createTweet(content,postType,hashtags,scheduledFor)
        return res.status(200).json({
            success:true,
            message:"Tweet created successfully",
            data:tweet
        })
            
   
})

export const getTweetsController = catchAsync(async (
  req: Request,
  res: Response,
  next:NextFunction
) => {

     const result = getTweetsSchema.safeParse(req.query);
     if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: JSON.stringify(result.error.flatten().fieldErrors),
    });
  }
   
 
    
   
    const query=result.data;
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
 
});


export const updateTweetController = catchAsync(async (
  req: Request,
  res: Response,
  next:NextFunction
) => {


  const paramResult = tweetIdSchema.safeParse(req.params);
     if (!paramResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: JSON.stringify(paramResult.error.flatten().fieldErrors),
    });
  }

    const bodyResult = updateTweetSchema.safeParse(req.body);
     if (!bodyResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: JSON.stringify(bodyResult.error.flatten().fieldErrors),
    });
  }
 
    
  const body=bodyResult.data;
  const{tweetId}=paramResult.data;

    const tweet = await tweetService.updateTweet(
      
      tweetId,
      body
    );

    return res.status(200).json({
      success: true,
      data: tweet,
    });
 
});

export const deleteTweetController = catchAsync(async (
  req: Request,
  res: Response,
  next:NextFunction
) => {

     const result = tweetIdSchema.safeParse(req.params);
     if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: JSON.stringify(result.error.flatten().fieldErrors),
    });
  }

      

  const{tweetId}=result.data;

    const response = await tweetService.deleteTweet( tweetId);

    return res.status(200).json(response);
 
});