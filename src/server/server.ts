import { app } from './app';
import { connectMySql } from './services/mysql';

const PORT = 3001;

const start = async () => {
  await connectMySql();
  //   await createDB('posts');
  console.log('connected to MySql database');
  // await createUserTable();
  // await populateUserTable();
  app.listen(PORT, () => {
    console.log('server listening on port ' + PORT);
  });
};

start();
