import { dbConnect } from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

// ⚠️ FOR LONG TIME NO USAGE FROM NGROK ENDPOINT MIGHT BE DISABLED FROM CLERK
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook userId: ${id}, EventType: ${eventType}`);

  // connect to database
  await dbConnect();

  if (evt.type === "user.created") {
    const user = {
      clerkId: evt.data.id,
      name: `${evt.data.first_name} ${evt.data.last_name}`,
      email: evt.data.email_addresses[0].email_address,
      picture: evt.data.image_url,
      role: "USER"
    } satisfies IUser;

    const newUser = await User.create(user);
    // console.log(newUser);

    const clerkUser = await clerkClient().users.updateUserMetadata(
      evt.data.id,
      {
        privateMetadata: {
          _id: newUser._id, // prevents querying twice for authentication and getting mongodb user
          role: "USER" // by default after a user is created the role will be USER, and we are setting newly created user's role to USER on the clerk dashboard
        },
        publicMetadata: {
          _id: newUser._id,
          role: "USER"
        }
      }
    );
    console.log(clerkUser.privateMetadata);
  }

  if (evt.type === "user.updated") {
    console.log("user role metadata update");
    await User.findOneAndUpdate(
      { clerkId: evt.data.id },
      {
        role: evt.data.private_metadata.role
      }
    );
  }

  if (evt.type === "user.deleted") {
    await User.findOneAndDelete({ clerkId: evt.data.id });
  }
  return new Response("Successful", { status: 200 });
}
