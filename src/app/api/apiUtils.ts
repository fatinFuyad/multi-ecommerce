import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";
import { Roles } from "@/types/global";
import { dbConnect } from "@/lib/dbConnect";

export async function restrictTo(role: Roles, fields: string = "role") {
  const authobj = await auth();
  console.log({ authobj });

  if (!authobj?.userId) {
    throw new Error("Unauthenticated! Please sign in to continue");
  }

  //  db connect
  await dbConnect();
  const query = User.findOne({
    clerkId: authobj.userId
  });
  if (fields) {
    query.select(fields);
  }
  const user = await query;

  if (user?.role !== role) {
    throw new Error(
      `Unauthorized Access! ${role} Privileges Required for Entry.`
    );
  }

  return user;
}
