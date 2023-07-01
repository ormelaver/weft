import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import path from 'path';

import { getAllUsersRouter } from './routes/get-users';
import { getUserPostsRouter } from './routes/get-Posts';
import { deletePostsRouter } from './routes/delete-posts';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cors());

app.use(getAllUsersRouter);
app.use(getUserPostsRouter);
app.use(deletePostsRouter);

app.use(express.static(path.resolve(__dirname, '../client/build/')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

app.all('*', async (req, res) => {
  throw new Error('route not found');
});

export { app };
