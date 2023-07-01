import express, { Request, Response } from 'express';
import { user } from '../utils/users';
const router = express.Router();

router.get('/api/users', async (req: Request, res: Response) => {
  try {
    const userList = await user.getUsers();
    res.send(userList);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

export { router as getAllUsersRouter };
