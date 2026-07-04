import "next-auth";
import { Types } from "mongoose";
import { Roles } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      _id: Types.ObjectId;
      name: string;
      username: string;
      email: string;
      image?: string; // image might not exists while credentials signup
      role: Roles;
    } | null;
    // & DefaultSession["user"]; // we modified the defualt next-auth user
  }
}

export type SessionUser = {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  image?: string;
  role: Roles;
};
//   interface User {
//     _id?: string;
//     username?: string;
//     email?: string;
//     role?: Roles;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     _id?: string;
//     username?: string;
//     email?: string;
//     role?: Roles;
//   }
// }
