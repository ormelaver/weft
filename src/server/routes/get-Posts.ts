import express, { Request, Response } from 'express';
import Post from '../utils/Posts';
const router = express.Router();

const post = Post.getInstance();
router.get('/api/posts', async (req: Request, res: Response) => {
  if (!req.query.userId) {
    throw new Error('Please provide a user id');
  }

  const userId = parseInt(req.query.userId as string);
  const limit = parseInt(req.query.limit as string) || 10;
  const pageNumber = parseInt(req.query.page as string) || 1;
  const startIndex = limit * (pageNumber - 1);
  const endIndex = startIndex + limit;

  let userPosts = await post.getPosts(userId);

  res.send(userPosts.slice(startIndex, endIndex));
});

export { router as getUserPostsRouter };
