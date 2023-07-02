import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import { PostType } from '../types/post';

let connection: Connection;
const connectMySql = async () => {
  try {
    connection = await mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_ROOT_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    await createDB('posts');
    await connection.query('USE posts');
    await createTable(
      'posts',
      [
        'id int(11) NOT NULL',
        'userId int(11) NOT NULL',
        'title varchar(255) DEFAULT NULL',
        'body varchar(255) DEFAULT NULL',
      ],
      ['id', 'userId']
    );
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createTable = async (
  tableName: string,
  columnNames: string[],
  primaryKeys: string[]
): Promise<void> => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${[...columnNames]} ${
    primaryKeys ? `,PRIMARY KEY (${primaryKeys})` : ')'
  })`;

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

export const populateTable = async (
  tableName: string,
  columnNames: string[],
  data: PostType[]
): Promise<void> => {
  const query = `INSERT INTO ${tableName} (${[...columnNames]}) VALUES ?`;

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

export const getRowsByCondition = async (
  tableName: string,
  columnNames: string[],
  columnName: string,
  columnValue: string | number,
  constraints: string[]
) => {
  const query = `SELECT ${[
    ...columnNames,
  ]} FROM ${tableName} WHERE ${columnName}=${columnValue} ${constraints.join(
    ' '
  )}`;

  try {
    const [userPosts] = await connection.query<RowDataPacket[]>(query);

    if (userPosts.length > 0) {
      return userPosts;
    } else {
      return [];
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getStoredUserIds = async (): Promise<RowDataPacket[]> => {
  const query = `SELECT DISTINCT userId FROM posts`;
  try {
    const [userIds] = await connection.query<RowDataPacket[]>(query);

    return userIds;
  } catch (error: any) {
    throw new Error(error);
  }
};
export { connection, connectMySql };
