export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  id: string;
  username: string;
  email: string;
  mobile: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
