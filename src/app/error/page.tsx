"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function ErrorPage() {
  const session = useSession();
  const user = session.data?.user;

  if (!user) redirect("/signin");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-red-500 text-4xl">An Error Occurred</h1>
      <h3>{user.name}</h3>
      <p>
        The route you are visiting got an error or the resources are unavailable for this
        moment. Please contact to the administrator if you think this is an issue that
        must be resolved.
      </p>
    </div>
  );
}

export default ErrorPage;
