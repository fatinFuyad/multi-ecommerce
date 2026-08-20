import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Roles } from "@/models/User";
import { SessionUser } from "@/types/next-auth";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";

type AuthSession<T> = T extends true
  ? {
      expires: string;
      user: SessionUser;
    }
  : {
      expires: string | null;
      user: SessionUser | null;
    };

/**
 * @description Checks the server session and authenticates user. Use this utility function on the server side pages.
 * @param isRedirect `boolean` if true then redirects unauthenticated users to the signin page. defualt: true
 * @returns Session
 */
export async function auth<T extends boolean = true>(
  { isRedirect }: { isRedirect: T } = { isRedirect: true as T }
): Promise<AuthSession<T>> {
  // Get the current user.
  // If the user is not authenticated, redirect user to the signin page.
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) {
    if (isRedirect) {
      return redirect("/signin");
    }
    return { expires: null, user: null } as AuthSession<T>;
  }
  return { expires: session.expires, user: session.user } as AuthSession<T>;
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
