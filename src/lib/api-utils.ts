import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Roles } from "@/models/User";
import { SessionUser } from "@/types/next-auth";
import { getServerSession } from "next-auth";

import { QueryWithHelpers } from "mongoose";
const x = "y";
export async function restrictTo(role: Roles): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthenticated. Please sign in to continue.");

  if (session.user.role !== role) {
    throw new Error(
      `Unauthorized Access! Your Account Requires ${role} Privileges to Perform this Action.`
    );
  }

  return session.user;
}

/**
 * @description Updates the query by adding populate, lean from the options if presents that are passed from the fronted as axios headers
 * @param reqHeaders - The headers of the Request object
 * @param query - mongoose query
 * @returns mongoose query
 */
export function handleQueryOptions<T>(
  reqHeaders: Headers,
  query: QueryWithHelpers<T[], T>
) {
  const options = {
    lean: reqHeaders.get("lean"),
    populate: reqHeaders.get("populate"),
    limitPopulateDoc: Number(reqHeaders.get("limitPopulateDoc")) || undefined
  };

  const newQuery = query;
  if (options.populate)
    options.populate
      .replaceAll(" ", "")
      .split(",")
      .forEach((field) =>
        newQuery.populate({
          path: field,
          perDocumentLimit: options.limitPopulateDoc
        })
      );
  if (options.lean) newQuery.lean();
  return newQuery;
}
