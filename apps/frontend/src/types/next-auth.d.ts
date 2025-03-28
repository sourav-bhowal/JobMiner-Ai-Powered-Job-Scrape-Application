import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    username?: string;
    email?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id?: string;
      username: string;
      email?: string;
      accessToken: string;
    };
  }
}
