import { UserType, Address } from '../types/user';

export const arrangeData = (originalData: any[]) => {
  let newData: UserType[] = [];
  for (let i = 0; i < originalData.length; i++) {
    newData[i] = {
      id: originalData[i].id,
      name: originalData[i].name,
      email: originalData[i].email,
      address: convertAddressToString({
        street: originalData[i].address.street,
        suite: originalData[i].address.suite,
        city: originalData[i].address.city,
        zipcode: originalData[i].address.zipcode,
      }),
    };
  }
  return newData;
};

const convertAddressToString = (addressObject: Address): string => {
  return `${addressObject.street}, ${addressObject.suite}, ${addressObject.city}, ${addressObject.zipcode}`;
};
