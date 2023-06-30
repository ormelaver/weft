import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import { PostType } from '../types/post';
import axios from 'axios';
// import { arrangeData } from '../utils/dataUtils';

let connection: Connection;
const connectMySql = async () => {
  try {
    connection = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '1234',
    });

    await createDB('posts');
    await connection.query('USE posts');
    await createTable('posts');
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createTable = async (tableName: string): Promise<void> => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (id int(11) NOT NULL, userId int(11) NOT NULL, title varchar(255) DEFAULT NULL, body varchar(255) DEFAULT NULL, PRIMARY KEY (id, userId))`;

  try {
    await connection.query(query);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createDB = async (dbName: string): Promise<void> => {
  const query = `CREATE DATABASE IF NOT EXISTS ${dbName}`;

  try {
    await connection.query(query);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteRow = async (
  tableName: string,
  userId: number,
  postId: number
): Promise<void> => {
  if (!userId || !postId) {
    throw new Error('Must provide user id and post id');
  }

  const query = `DELETE FROM ${tableName} WHERE userId=${userId} AND id=${postId}`;

  try {
    await connection.query(query);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const populatePosts = async (data: PostType[]): Promise<void> => {
  const query = `INSERT INTO posts (userId, id, title, body) VALUES ?`;
  // console.log('data', data);

  try {
    const values = [
      data.map((post) => {
        return [post.userId, post.id, post.title, post.body];
      }),
    ];

    await connection.query(query, values);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUserPostsFromDB = async (
  userId: number
): Promise<RowDataPacket[] | boolean> => {
  const query = `SELECT id, userId, title, body FROM posts WHERE userId=${userId}`;

  try {
    const [userPosts] = await connection.query<RowDataPacket[]>(query);

    if (userPosts.length > 0) {
      return userPosts;
    } else {
      return false;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getStoredUserIds = async (): Promise<RowDataPacket[]> => {
  const query = `SELECT DISTINCT userId FROM posts`;
  try {
    const [userIds] = await connection.query<RowDataPacket[]>(query);

    // if (userIds.length > 0) {
    return userIds;
    // }
  } catch (error: any) {
    throw new Error(error);
  }
};
export { connection, connectMySql };
