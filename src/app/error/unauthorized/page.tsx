"use client";

import { useUser } from "@clerk/nextjs";

function UnauthorizedPage() {
  const userData = useUser();

  return (
    <div className="flex flex-col gap-6">
      <h3>{userData.user?.fullName}</h3>
      <h1 className="text-red-500 text-4xl">
        You are Unauthorized to access this route
      </h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id dolorum ab
        aliquid. Fuga, ea accusantium ab a aspernatur exercitationem enim aut
        esse. Est tempora accusamus, cumque et dolore nihil nobis.
      </p>
    </div>
  );
}

export default UnauthorizedPage;
