"use client";

import { signOut } from "next-auth/react";
import { Button } from "./button";

export function SignInOutButton({ type = "signin" }: { type: "signin" | "signout" }) {
  if (type === "signin") return <Button onClick={() => signOut()}>Sign In</Button>;
  if (type === "signout") return <Button onClick={() => signOut()}>Sign Out</Button>;
}
