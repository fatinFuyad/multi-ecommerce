import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function DashboardPage() {
  const user = await currentUser();
  console.log({ user });

  if (!user?.privateMetadata.role || user.privateMetadata.role === "USER")
    redirect("/");
  if (user?.privateMetadata.role === "ADMIN") redirect("/dashboard/admin");
  if (user?.privateMetadata.role === "SELLER") redirect("/dashboard/seller");
  return (
    <div className="text-center m-4">
      <h1 className="text-4xl text-cyan-400">Dashboard Page</h1>
      <h3>Statistics Data</h3>
    </div>
  );
}

export default DashboardPage;
