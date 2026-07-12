import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function DashboardPage() {
  const { user } = await auth();

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
