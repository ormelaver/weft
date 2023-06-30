import express, { Request, Response } from 'express';
import { user } from '../utils/users';
const router = express.Router();

router.get('/api/users', async (req: Request, res: Response) => {
  if (!req.query.page) {
    throw new Error('please provide a page number');
  }
  try {
    const userList = await user.getUsers();
    res.send(userList);
  } catch (error: any) {
    throw new Error(error);
  }
});

export { router as getAllUsersRouter };
