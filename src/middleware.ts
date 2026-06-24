import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// TODO: Check it later
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  // verify authentication base on tokens with getToken()
  const token = await getToken({ req: request }); // returns token: null; when user is not signed up or doesn't exist on database but trying to sign in
  const url = request.nextUrl;
  // const cookieUser = request.cookies.get("jwt")?.value;
  // const session = await getServerSession;
  // console.log(session, "middleware");

  // console.log({ token });
  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith("/signin") || url.pathname.startsWith("/signup"))
    // url.pathname.startsWith("/verify"))
    //  ||url.pathname === "/"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url)); // default:/api/auth/signin
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"]
};
