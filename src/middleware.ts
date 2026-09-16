import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getUserCountry } from "./lib/utils";

// runs for every page that satisfies the matcher
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  // verify authentication based on jwt token
  const token = await getToken({ req: request }); // returns token | null;
  const { pathname } = request.nextUrl;
  // const jwtCookie = request.cookies.get("jwt")?.value;
  const countryCookie = request.cookies.get("userCountry");
  console.log("Middleware-->", { countryCookie });
  let response = NextResponse.next();

  // if the country user has already selected. otherwise set cookie for userCountry.
  if (!countryCookie) {
    // refreshing the req when user changes his country
    response = NextResponse.redirect(new URL(request.url));

    // set a cookie with the detected country for further requests
    const userCountry = await getUserCountry();
    response.cookies.set("userCountry", JSON.stringify(userCountry), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30
    });
  }

  // Redirect to dashboard if the user is already authenticated and trying to access signin, signup
  if (token && (pathname.startsWith("/signin") || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"]
};
