export type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  phone: string;
  username: string;
  image: string;

  company?: {
    department?: string;
    title?: string;
  };

  // برای DataGrid
  fullName?: string;
  department?: string;
};

export type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

export type UserForm = {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phone: string;
  username: string;
};