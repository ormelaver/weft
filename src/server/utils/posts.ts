import axios from 'axios';
import { getUserPostsFromDB, populatePosts } from '../services/mysql';
// import { arrangeData } from './dataUtils';
// import { User } from '../types/user';

class Post {
  private async getUsersFromExternal(x: number) {}

  public async getPosts(userId: string) {
    let userPosts = await getUserPostsFromDB(userId);

    if (!userPosts) {
      console.log('User posts do not exist in DB, fetching...');
      const newPosts = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
      await populatePosts(newPosts.data, userId);
      //   console.log(newPosts.data);
      return newPosts.data;
    }

    return userPosts;
  }
}

export const post = new Post();
