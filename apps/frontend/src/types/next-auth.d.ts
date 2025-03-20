import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    user: {
      id: string;
      username: string;
      email: string;
      accessToken: string;
    };
  }

  interface User {
    id: string;
    username: string;
    email: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id?: string | null;
      username: string;
      email?: string | null;
      accessToken: string;
    };
  }
}
