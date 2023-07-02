import axios from 'axios';
import { UserType, Address } from '../types/user';

class User {
  private _users: UserType[] = [];

  private async getUsersFromExternal() {
    console.log('Fetching users from external API...');
    if (!process.env.USERS_EXTERNAL_API) {
      throw new Error('No users data source provided');
    }
    const users = await axios.get(process.env.USERS_EXTERNAL_API);
    const newUserData = await this.arrangeData(users.data);
    this._users = newUserData;
  }

  public async getUsers() {
    if (this._users.length === 0) {
      await this.getUsersFromExternal();
    }
    return this._users;
  }

  private arrangeData(originalData: any[]) {
    let newData: UserType[] = [];
    for (let i = 0; i < originalData.length; i++) {
      newData[i] = {
        id: originalData[i].id,
        name: originalData[i].name,
        email: originalData[i].email,
        address: this.convertAddressToString({
          street: originalData[i].address.street,
          suite: originalData[i].address.suite,
          city: originalData[i].address.city,
          zipcode: originalData[i].address.zipcode,
        }),
      };
    }
    return newData;
  }

  private convertAddressToString(addressObject: Address) {
    return `${addressObject.street}, ${addressObject.suite}, ${addressObject.city}, ${addressObject.zipcode}`;
  }
}

export const user = new User();
