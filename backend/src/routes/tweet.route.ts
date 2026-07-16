import { Router } from "express";
import { createTweet, deleteTweetController, enhanceTweet, getTweetsController, updateTweetController } from "../controllers/tweet.controller.js";

const router=Router();

router.post('/',createTweet);
router.post('/enhance',enhanceTweet);
router.get('/',getTweetsController);
router.delete('/:tweetId',deleteTweetController);
router.patch('/:tweetId',updateTweetController);


export default router