import express, { Request, Response } from 'express';
import { user } from '../utils/users';
const USERS_PER_PAGE = 4;
const router = express.Router();

router.get('/api/users/:page', async (req: Request, res: Response) => {
  const userList = await user.getUsers();
  const page = parseInt(req.params.page);
  const startIndex = USERS_PER_PAGE * (page - 1);
  const endIndex = startIndex + USERS_PER_PAGE;
  res.send(userList.slice(startIndex, endIndex));
});

export { router as getAllUsersRouter };
