"use client";

import { SessionUser } from "@/types/next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function UnauthorizedPage() {
  const session = useSession();
  const user: SessionUser = session.data?.user;

  if (!user) redirect("/signin");

  return (
    <div className="flex flex-col gap-6">
      <h3>{user.name}</h3>
      <h1 className="text-red-500 text-4xl">
        You are Unauthorized to access this page
      </h1>
      <p>
        You ( as {user.role.toLowerCase()}) do not have permission to view or
        make any changes on this page. Contact support from administrator and
        upgrade your account if you believe that you require additional
        permissions.
      </p>
    </div>
  );
}

export default UnauthorizedPage;
