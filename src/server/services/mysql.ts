import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import { PostType } from '../types/post';
import axios from 'axios';
// import { arrangeData } from '../utils/dataUtils';

let connection: Connection;
const connectMySql = async () => {
  connection = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
  });

  // await connection.connect();
  await createDB('posts');
  await connection.query('USE posts');
  await createTable('posts');
};

export const createTable = async (tableName: string) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (id int(11) NOT NULL, userId int(11) NOT NULL, title varchar(255) DEFAULT NULL, body varchar(255) DEFAULT NULL, PRIMARY KEY (id, userId))`;
  await connection.query(query);
};

export const createDB = async (dbName: string) => {
  const query = `CREATE DATABASE IF NOT EXISTS ${dbName}`;

  await connection.query(query);
};

export const populatePosts = async (data: PostType[], userId: string) => {
  const query = `INSERT INTO posts (userId, id, title, body) VALUES ?`;
  // console.log('data', data);
  const values = [
    data.map((post) => {
      return [post.userId, post.id, post.title, post.body];
    }),
  ];

  // console.log(query);
  // console.log(values);

  await connection.query(query, values);
};

export const getUserPostsFromDB = async (
  userId: string
): Promise<RowDataPacket[] | boolean> => {
  const query = `SELECT title, body FROM posts WHERE userId=${userId}`;
  const [userPosts] = await connection.query<RowDataPacket[]>(query);

  if (userPosts.length > 0) {
    return userPosts;
  } else {
    return false;
  }
};

export { connection, connectMySql };
