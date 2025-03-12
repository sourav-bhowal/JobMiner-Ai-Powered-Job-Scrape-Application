interface CustomUser {
  id: string;
  email: string;
  username: string;
}

declare namespace Express {
  export interface Request {
    user: CustomUser;
  }
}
