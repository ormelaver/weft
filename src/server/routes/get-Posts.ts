import express, { Request, Response } from 'express';
import Post from '../utils/Posts';
const router = express.Router();

const post = Post.getInstance();
router.get('/api/posts', async (req: Request, res: Response) => {
  if (!req.query.userId) {
    return res.status(400).send({ error: 'Missing userId' });
  }

  const userId = parseInt(req.query.userId as string);
  const limit =
    (req.query.limit as string) || (process.env.POSTS_PAGE_LIMIT as string);
  const pageNumber =
    (req.query.page as string) || (process.env.DEFAULT_PAGE_NUMBER as string);

  try {
    const userPosts = await post.getPosts(
      userId,
      parseInt(pageNumber),
      parseInt(limit)
    );

    res.status(200).send(userPosts);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

export { router as getUserPostsRouter };
