import { currentUser } from "@clerk/nextjs/server";

async function AdminDashboardPage() {
  return (
    <div className="grid gap-6 p-8">
      <h1 className="text-4xl text-cyan-400">Admin Page</h1>
      <h3>Welcome Admin, start managing</h3>
      <p>
        This is the protected ADMIN dashboard restricted to users with the
        `ADMIN` Role.
      </p>
    </div>
  );
}

export default AdminDashboardPage;
