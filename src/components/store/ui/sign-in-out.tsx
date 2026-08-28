"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./button";

export function SignInOutButton({ type = "signin" }: { type: "signin" | "signout" }) {
  if (type === "signin")
    return (
      <Button>
        <Link href={"/signin"}>Sign In</Link>
      </Button>
    );
  if (type === "signout") return <Button onClick={() => signOut()}>Sign Out</Button>;
}
