import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Roles } from "@/models/User";
import { SessionUser } from "@/types/next-auth";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";

/**
 * @description Checkes the server session and authenticates user. Use this utility function on the server side pages.
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

/**
 * @description  prevents unauthorized users from accessing certain routes, pages and redirect user to unauthorized page. Use this utility function on the server side pages.
 * @returns `Promise<SessionUser>`
 */
export async function authorize(role: Roles): Promise<SessionUser> {
  const { user } = await auth();
  if (user.role !== role) return redirect("/error/unauthorized");
  return user;
}
