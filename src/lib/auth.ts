import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { SessionUser } from "@/types/next-auth";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";

/**
 * @description Checkes the server session and authenticates user. Use this utility function on the server side routes
 * @returns Session
 */
export async function auth(): Promise<{
  expires: string;
  user: SessionUser;
}> {
  // Get the current user.
  // If the user is not authenticated, redirect user to the signin page.
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) {
    return redirect("/signin");
  }

  return { expires: session.expires, user: session.user };
}
