export interface User {
  _id: string;
  name: string;
  email: string;
  role: number;
  jwtToken: string;
}

export interface UserList {
  data: User[];
}

export interface UserListConfig {
  role?: number | string;
  page?: number | string;
  limit?: number | string;
}
