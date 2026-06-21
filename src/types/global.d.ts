import mongoose from "mongoose";

export {};

// Create a type for the Roles
export type Roles = "ADMIN" | "SELLER" | "USER"; // "admin" | "moderator";

declare global {
  // interface UserPublicMetadata {
  //   publicMetadata: {
  //     role: Roles;
  //   };
  // }

  interface UserPrivateMetadata {
    role: Roles;
    _id: mongoose.Types.ObjectId;
  }
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
