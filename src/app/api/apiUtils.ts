import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]/options";
import { Roles } from "@/models/User";
import { SessionUser } from "@/types/next-auth";

export async function restrictTo(role: Roles): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    throw new Error("Unauthenticated. Please sign in to continue.");

  if (session.user.role !== role) {
    throw new Error(
      `Unauthorized Access! Your Account Requires ${role} Privileges to Perform this Action.`
    );
  }

  return session.user;
}
