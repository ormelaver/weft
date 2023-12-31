import axios from 'axios';
import {
  getRowsByCondition,
  populateTable,
  deleteRow,
  getStoredUserIds,
} from '../services/mysql';

class Post {
  //save all users' ids that their posts exist in the DB so we won't need to access the DB on each call
  private currentUserPosts: number[] = [];
  private static instance: Post;

  private constructor() {}

  public static getInstance(): Post {
    if (!Post.instance) {
      Post.instance = new Post();
    }
    return Post.instance;
  }

  public async getPosts(
    userId: number,
    pageNumber: number = 1,
    limit: number = 10
  ) {
    const isUserInPostList = this.isUserInPostList(userId);
    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    let userPosts;
    if (!isUserInPostList) {
      console.log(
        'User posts do not exist in DB, fetching from external API...'
      );
      if (!process.env.POSTS_EXTERNAL_API) {
        throw new Error('No posts data source provided');
      }
      const newPosts = await axios.get(process.env.POSTS_EXTERNAL_API + userId);

      await populateTable(
        'posts',
        ['userId', 'id', 'title', 'body'],
        newPosts.data
      );

      this.updateUserPostsList(userId);
      userPosts = newPosts.data.slice(startIndex, endIndex);
    } else {
      console.log('User posts exist in DB, fetching from DB...');
      userPosts = await getRowsByCondition('posts', ['*'], 'userId', userId, [
        'ORDER BY id ASC',
        `LIMIT ${limit * (pageNumber - 1)}, ${limit}`,
      ]);
    }

    return {
      data: userPosts,
      pageNumber,
      limit,
    };
  }

  public async deletePosts(userId: number, postId: number): Promise<void> {
    try {
      await deleteRow('posts', userId, postId);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async populatePostList() {
    try {
      const userIds = await getStoredUserIds();

      userIds.map((user) => {
        this.currentUserPosts.push(user.userId);
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private isUserInPostList(userId: number): boolean {
    return this.currentUserPosts.indexOf(userId) > -1;
  }

  private updateUserPostsList(userId: number): void {
    this.currentUserPosts.push(userId);
  }
}

export default Post;
