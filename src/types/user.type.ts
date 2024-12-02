// import { Paging } from './paging.type'

export interface User {
  _id: string
  name: string
  email: string
  role: number
  jwtToken: string
  // status: number
  // created_at: string
  // updated_at: string
  // phone: string
  // address: string
}

export interface UserList {
  data: User[]
//   paging: Paging
}

export interface UserListConfig {
  role?: number | string
  page?: number | string
  limit?: number | string
}
