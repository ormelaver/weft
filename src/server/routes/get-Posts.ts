import express, { Request, Response } from 'express';
import axios from 'axios';
import { post } from '../utils/Posts';
const router = express.Router();

router.get('/api/posts/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  let userPosts = await post.getPosts(userId);

  res.send(userPosts);
});

export { router as getUserPostsRouter };
