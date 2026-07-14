import { Router } from "express";
import { createTweet, enhanceTweet } from "../controllers/tweet.controller.js";

const router=Router();

router.post('/',createTweet);
router.post('/enhance',enhanceTweet);
router.get('/');
router.delete('/:tweetId');
router.patch('/:tweetId');


export default router