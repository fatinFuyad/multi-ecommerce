import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// '/route(.*)' means this route and all subsequent routes
// '/route/(.*) means after the subsequent routes
const protectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  "/checkout",
  "/profile",
  "/profile/(.*)"
]);
export default clerkMiddleware(async (auth, req) => {
  if (protectedRoutes(req)) {
    await auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
