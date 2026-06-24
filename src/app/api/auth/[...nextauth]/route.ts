import NextAuth from "next-auth";
import { authOptions } from "./options";

// A Route Handler file expects you to export some named handler functions that handle a request and return a response.
// NextAuth.js needs the GET and POST handlers to function properly, so we export those two.

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
