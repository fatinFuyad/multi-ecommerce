import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/options";

async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) redirect("/signin");
  if (user.role === "USER") return redirect("/");
  if (user.role === "ADMIN") return redirect("/dashboard/admin");
  if (user.role === "SELLER") return redirect("/dashboard/seller");
  return (
    <div className="text-center m-4">
      <h1 className="text-4xl text-cyan-400">Dashboard Page</h1>
      <h3>Statistics Data</h3>
    </div>
  );
}

export default DashboardPage;
