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
  }
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
