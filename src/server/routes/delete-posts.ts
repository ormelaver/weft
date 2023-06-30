import express, { Request, Response } from 'express';
import Post from '../utils/Posts';
const router = express.Router();
const post = Post.getInstance();

router.delete('/api/posts', async (req: Request, res: Response) => {
  if (!req.query.userId || !req.query.id) {
    throw new Error('Must provide user id and post id');
  }
  const userId = parseInt(req.query.userId as string);
  const postId = parseInt(req.query.id as string);

  await post.deletePosts(userId, postId);
  res.send({ message: 'post deleted successfully' });
});

export { router as deletePostsRouter };
