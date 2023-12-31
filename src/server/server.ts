import { app } from './app';
import { connectMySql } from './services/mysql';
import Post from './utils/Posts';
import 'dotenv/config';

const post = Post.getInstance();
const PORT = process.env.PORT;

const start = async () => {
  await connectMySql();
  await post.populatePostList();
  console.log('connected to MySql database');

  app.listen(PORT, () => {
    console.log('server listening on port ' + PORT);
  });
};

start();
