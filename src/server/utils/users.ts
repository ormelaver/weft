import axios from 'axios';
import { arrangeData } from './dataUtils';
import { UserType } from '../types/user';

class User {
  private _users: UserType[] = [];

  private async getUsersFromExternal() {
    console.log('Fetching users from external API...');
    const users = await axios.get('https://jsonplaceholder.typicode.com/users');
    const newUserData = await arrangeData(users.data);
    this._users = newUserData;
  }

  public async getUsers() {
    if (this._users.length === 0) {
      await this.getUsersFromExternal();
    }
    return this._users;
  }
}

export const user = new User();
